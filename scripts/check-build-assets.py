#!/usr/bin/env python3
"""check-build-assets.py — 上线前的品牌资产解码体检（fail-closed）

背景（2026-11-25）：品牌线把 src/app/favicon.ico 换成了 RGB 的 PNG-in-ICO，
Turbopack 直接拒绝解码：`Format error decoding Ico: The PNG is not in RGBA format!`
当天因此挂了两次生产构建（058ea10、a48bd40），线上停在旧版本十几小时。

本脚本只做“构建会炸”的静态检查，不改文件：
  1. src/app/favicon.ico —— 必须是 ICO；PNG 帧的 IHDR 颜色类型必须是 6(RGBA)，BMP 帧必须是 32 位
  2. 多尺寸 —— 至少包含 16×16 与 32×32
  3. src/app/icon.png —— 可解码、正方形、边长 ≥192
  4. src/app/apple-icon.png —— 可解码、正方形、边长 ≥180

为什么不用 PIL 判断 RGBA：PIL 读 ICO 只暴露一帧，而且会把 RGB 静默 convert 成 RGBA，
恰好放过本次事故的那类文件。所以这里直接读 ICO 二进制目录 + PNG IHDR。

退出码: 0 = 全部通过；1 = 有会阻断构建的问题
用法:
  python3 scripts/check-build-assets.py
  python3 scripts/check-build-assets.py --verbose
"""
from __future__ import annotations

import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICON_DIR = ROOT / "src" / "app"
VERBOSE = "--verbose" in sys.argv
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"

errors: list[str] = []
notes: list[str] = []


def fail(msg: str, fix: str = "") -> None:
    errors.append(msg)
    print(f"❌ {msg}")
    if fix:
        print(f"   修法: {fix}")


def ok(msg: str) -> None:
    if VERBOSE:
        print(f"✅ {msg}")


def png_color_type(payload: bytes) -> int | None:
    """返回 PNG IHDR 的 color type：0 灰度 / 2 RGB / 3 调色板 / 4 灰度+A / 6 RGBA。"""
    if not payload.startswith(PNG_MAGIC):
        return None
    # IHDR 必须是第一个 chunk：长度(4) + "IHDR"(4) + 数据(13)
    if len(payload) < 33 or payload[12:16] != b"IHDR":
        return None
    return payload[25]


def check_ico(path: Path) -> None:
    rel = path.relative_to(ROOT)
    if not path.exists():
        fail(f"{rel} 不存在", "导出 16/32/48 三尺寸 RGBA ICO")
        return

    data = path.read_bytes()
    if len(data) < 6:
        fail(f"{rel} 不是合法 ICO（文件太小）", "重新导出 ICO")
        return
    reserved, itype, count = struct.unpack_from("<HHH", data, 0)
    if reserved != 0 or itype != 1 or count == 0:
        fail(f"{rel} 不是合法 ICO（type={itype}, entries={count}）", "用 format='ICO' 重新导出")
        return
    if len(data) < 6 + 16 * count:
        fail(f"{rel} 目录被截断（声明 {count} 帧）", "重新导出 ICO")
        return

    sizes: list[tuple[int, int]] = []
    bad: list[str] = []
    for i in range(count):
        w, h, _colors, _rsv, _planes, bitcount, nbytes, offset = struct.unpack_from(
            "<BBBBHHII", data, 6 + 16 * i
        )
        w = w or 256
        h = h or 256
        sizes.append((w, h))
        if offset + nbytes > len(data) or nbytes == 0:
            bad.append(f"{w}×{h} 帧数据越界")
            continue
        payload = data[offset : offset + nbytes]
        ctype = png_color_type(payload)
        if ctype is not None:
            if ctype != 6:
                bad.append(f"{w}×{h} 的 PNG 颜色类型={ctype}（需要 6=RGBA）")
        elif bitcount < 32:
            bad.append(f"{w}×{h} 的 BMP 位深={bitcount}（需要 32）")

    if bad:
        fail(
            f"{rel} 有 {len(bad)} 个帧会被 Turbopack 拒绝：{'; '.join(bad)}。"
            "错误形如 `The PNG is not in RGBA format!`，会让整个生产构建失败",
            "Image.open('src/app/icon.png').convert('RGBA').save('src/app/favicon.ico', "
            "format='ICO', sizes=[(16,16),(32,32),(48,48)])",
        )
        return

    need = {(16, 16), (32, 32)}
    missing = need - set(sizes)
    if missing:
        fail(f"{rel} 缺少尺寸 {sorted(missing)}（现有 {sizes}）", "sizes=[(16,16),(32,32),(48,48)]")
        return

    notes.append(f"favicon.ico {count} 帧全部 RGBA，尺寸 {sorted(sizes)}")
    ok(notes[-1])


def check_png(path: Path, min_side: int) -> None:
    """只读 PNG 头（不依赖 Pillow）：签名 + IHDR 的宽高，够判断"能不能被构建解码"。"""
    rel = path.relative_to(ROOT)
    if not path.exists():
        fail(f"{rel} 不存在", "补一张正方形 PNG")
        return
    try:
        head = path.read_bytes()[:33]
    except OSError as exc:
        fail(f"{rel} 读不了：{exc}", "重新导出 PNG")
        return
    if head[:8] != b"\x89PNG\r\n\x1a\n" or head[12:16] != b"IHDR":
        fail(f"{rel} 不是 PNG（签名/IHDR 不对）", "重新导出 PNG")
        return
    w, h = struct.unpack(">II", head[16:24])
    color_type = head[25]
    if w != h:
        fail(f"{rel} 不是正方形（{w}×{h}）", "导出正方形 PNG")
        return
    if min(w, h) < min_side:
        fail(f"{rel} 太小（{w}×{h}，要求 ≥{min_side}）", f"导出 ≥{min_side}px 正方形 PNG")
        return
    if color_type != 6:
        fail(f"{rel} 颜色类型 {color_type}（Turbopack 需要 RGBA=6）", "导出 RGBA PNG")
        return
    ok(f"{rel} PNG RGBA {w}×{h}")


def main() -> int:
    check_ico(ICON_DIR / "favicon.ico")
    check_png(ICON_DIR / "icon.png", 192)
    check_png(ICON_DIR / "apple-icon.png", 180)

    if errors:
        print(f"\n❌ 品牌资产体检未通过：{len(errors)} 个问题（push 会被拦下）")
        return 1
    print("✅ 品牌资产体检通过" + (f"（{'; '.join(notes)}）" if notes else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())

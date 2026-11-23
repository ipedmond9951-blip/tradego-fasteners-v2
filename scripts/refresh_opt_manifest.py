#!/usr/bin/env python3
"""刷新 src/lib/optImageManifest.ts：扫描 public/images/opt 下已有 hero 衍生图。"""
import glob, os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
bases = sorted({os.path.basename(f).replace('-hero.webp', '') for f in glob.glob('public/images/opt/*-hero.webp')})
body = ",\n".join(f'  "{b}"' for b in bases)
content = (
    "// 由 scripts/gen_opt_images.sh 生成：已存在优化衍生版的图片 base name\n"
    "export const OPT_BASES = new Set<string>([\n" + body + "\n])\n"
)
open('src/lib/optImageManifest.ts', 'w').write(content)
print(f"manifest {len(bases)} bases")

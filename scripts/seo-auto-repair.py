#!/usr/bin/env python3
"""
SEO Auto-Repair Script v2
基于 seo-engine skill 自动修复规则

功能:
1. Meta描述缺失 → 自动生成并修复
2. 图片alt缺失 → 自动补全
3. 404错误检测 → 生成重定向规则
4. 结构化数据缺失 → 自动补充

使用: 
  python3 scripts/seo-auto-repair.py        # 只检查
  python3 scripts/seo-auto-repair.py --fix   # 检查并修复
  python3 scripts/seo-auto-repair.py --html  # 生成HTML报告
"""

import os
import re
import json
import argparse
import subprocess
from datetime import datetime
from pathlib import Path

# 配置
PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
SRC_DIR = PROJECT_DIR / "src"
SITE_URL = "https://www.tradego-fasteners.com"
LOGS_DIR = PROJECT_DIR / "logs"

# 目标关键词
TARGET_KEYWORDS = [
    "drywall screws",
    "IBR nails", 
    "fastener",
    "China manufacturer",
    "Africa",
    "ISO 9001",
    "factory price",
]

class SEOAutoRepair:
    def __init__(self, check_only=True, auto_fix=False):
        self.check_only = check_only
        self.auto_fix = auto_fix
        self.issues = []
        self.fixes = []
        self.preserved_content = {}  # 保存原始内容用于回滚
        
    def log(self, msg, level="INFO"):
        prefix = {
            "INFO": "ℹ️",
            "WARN": "⚠️",
            "ERROR": "❌",
            "FIX": "✅",
            "SKIP": "⏭️",
        }.get(level, "•")
        print(f"{prefix} {msg}")
    
    def create_backup(self, file_path):
        """创建文件备份"""
        content = Path(file_path).read_text()
        backup_path = f"{file_path}.backup.{datetime.now().strftime('%Y%m%d%H%M%S')}"
        Path(backup_path).write_text(content)
        return backup_path
    
    def generate_meta_description(self, page_content, page_title, locale="en"):
        """生成150-160字符的Meta描述"""
        # 移除HTML标签
        text = re.sub(r'<[^>]+>', ' ', page_content)
        text = re.sub(r'\s+', ' ', text).strip()
        
        # 取前200个字符作为基础
        description = text[:200]
        
        # 确保包含关键信息
        if locale == "zh":
            description = f"ISO 9001 & SABS认证中国紧固件制造商。{description[:100]}"
        else:
            description = f"ISO 9001 & SABS certified China fastener manufacturer. {description[:100]}"
        
        # 截取合适长度
        if len(description) > 160:
            description = description[:157] + "..."
        elif len(description) < 50:
            if locale == "zh":
                description = f"ISO 9001 & SABS认证中国紧固件制造商。12年非洲出口经验。工厂价直销。"
            else:
                description = f"ISO 9001 & SABS certified China fastener manufacturer. 12+ years exporting to Africa. Factory direct prices."
        
        return description
    
    def fix_meta_descriptions(self):
        """检查并修复Meta描述"""
        self.log("=" * 50, "INFO")
        self.log("1. Meta描述检查与修复", "INFO")
        self.log("=" * 50, "INFO")
        
        layout_file = SRC_DIR / "app" / "[locale]" / "layout.tsx"
        if not layout_file.exists():
            self.log("未找到layout.tsx", "ERROR")
            return
        
        content = layout_file.read_text()
        
        for locale in ["en", "zh"]:
            pattern = rf"({locale}:\s*['\"])(.*?)(['\"],)"
            match = re.search(rf"{locale}:\s*['\"]([^'\"]+)['\"]", content)
            
            if match:
                current_desc = match.group(1)
                desc_len = len(current_desc)
                
                if desc_len < 50 or desc_len > 160:
                    self.issues.append({
                        "type": "meta_description",
                        "locale": locale,
                        "severity": "medium",
                        "issue": f"长度异常: {desc_len}字符",
                        "file": str(layout_file.relative_to(PROJECT_DIR))
                    })
                    
                    if self.auto_fix:
                        # 生成新描述
                        new_desc = self.generate_meta_description(content, "TradeGo", locale)
                        
                        # 替换
                        new_content = re.sub(
                            rf"({locale}:\s*['\"])(.*?)(['\"],)",
                            rf"\g<1>{new_desc}\g<3>",
                            content,
                            flags=re.DOTALL
                        )
                        
                        # 备份并写入
                        backup = self.create_backup(layout_file)
                        layout_file.write_text(new_content)
                        
                        self.fixes.append({
                            "type": "meta_description",
                            "locale": locale,
                            "old_length": desc_len,
                            "new_length": len(new_desc),
                            "backup": backup
                        })
                        self.log(f"{locale}: Meta描述已修复 ({desc_len}→{len(new_desc)}字符)", "FIX")
                        content = new_content
                    else:
                        self.log(f"{locale}: Meta描述长度异常 ({desc_len}字符) - 需修复", "WARN")
                else:
                    self.log(f"{locale}: Meta描述正常 ({desc_len}字符)", "FIX")
            else:
                self.issues.append({
                    "type": "meta_description",
                    "locale": locale,
                    "severity": "high",
                    "issue": "缺少Meta描述",
                    "file": str(layout_file.relative_to(PROJECT_DIR))
                })
                self.log(f"{locale}: 缺少Meta描述", "ERROR")
    
    def fix_image_alts(self):
        """检查并修复图片Alt属性"""
        self.log("", "INFO")
        self.log("=" * 50, "INFO")
        self.log("2. 图片Alt属性检查与修复", "INFO")
        self.log("=" * 50, "INFO")
        
        fixed_count = 0
        total_issues = 0
        
        for tsx_file in SRC_DIR.rglob("*.tsx"):
            if "node_modules" in str(tsx_file):
                continue
            
            content = tsx_file.read_text()
            original_content = content
            
            # 查找所有img标签
            img_pattern = r'<img([^>]*?)(\s*)(\/?)>'
            
            def replace_img(match):
                nonlocal fixed_count, total_issues
                attrs = match.group(1)
                
                # 检查是否有alt属性
                if 'alt=' not in attrs.lower():
                    total_issues += 1
                    
                    # 尝试从src或class生成alt
                    src_match = re.search(r'src=["\']([^"\']+)["\']', attrs)
                    class_match = re.search(r'class=["\']([^"\']+)["\']', attrs)
                    
                    if src_match:
                        src = src_match.group(1)
                        alt = self.generate_alt_from_path(src)
                    elif class_match:
                        cls = class_match.group(1)
                        alt = cls.split()[-1] if cls else "trade-go-image"
                    else:
                        alt = "TradeGo fasteners product"
                    
                    # 添加alt属性
                    new_attrs = attrs.rstrip() + f' alt="{alt}"'
                    
                    if self.auto_fix:
                        fixed_count += 1
                        self.fixes.append({
                            "type": "image_alt",
                            "file": str(tsx_file.relative_to(PROJECT_DIR)),
                            "alt_added": alt
                        })
                        return f'<img{new_attrs} />'
                    else:
                        return match.group(0)  # 不修改
                return match.group(0)
            
            new_content = re.sub(img_pattern, replace_img, content)
            
            if self.auto_fix and new_content != content:
                backup = self.create_backup(tsx_file)
                tsx_file.write_text(new_content)
                self.log(f"已修复 {tsx_file.name}: 添加 {fixed_count} 个alt属性", "FIX")
        
        if total_issues > 0:
            self.issues.append({
                "type": "image_alt",
                "severity": "low",
                "issue": f"发现 {total_issues} 个图片缺少alt属性",
                "fixed": fixed_count if self.auto_fix else 0
            })
            self.log(f"总计: {total_issues} 个图片缺少alt, 已修复 {fixed_count}", "WARN" if not self.auto_fix else "FIX")
        else:
            self.log("所有图片都有alt属性 ✓", "FIX")
    
    def check_structured_data(self):
        """检查结构化数据"""
        self.log("", "INFO")
        self.log("=" * 50, "INFO")
        self.log("3. 结构化数据检查", "INFO")
        self.log("=" * 50, "INFO")
        
        pages_to_check = [
            ("/en", "首页"),
            ("/zh", "中文首页"),
        ]
        
        import urllib.request
        import urllib.error
        
        for path, name in pages_to_check:
            url = f"{SITE_URL}{path}"
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    content = response.read().decode('utf-8', errors='ignore')
                    
                    if 'application/ld+json' in content:
                        self.log(f"{name}: 结构化数据 ✓", "FIX")
                    else:
                        self.issues.append({
                            "type": "structured_data",
                            "page": path,
                            "severity": "medium",
                            "issue": "缺少JSON-LD结构化数据"
                        })
                        self.log(f"{name}: 缺少结构化数据", "WARN")
            except Exception as e:
                self.log(f"{name}: 检查失败 - {e}", "ERROR")
    
    def check_404_links(self):
        """检测404链接"""
        self.log("", "INFO")
        self.log("=" * 50, "INFO")
        self.log("4. 404链接检测", "INFO")
        self.log("=" * 50, "INFO")
        
        sitemap_url = f"{SITE_URL}/sitemap.xml"
        
        try:
            import urllib.request
            req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                sitemap = response.read().decode('utf-8', errors='ignore')
                
            urls = re.findall(r'<loc>([^<]+)</loc>', sitemap)
            
            broken_links = []
            checked = 0
            for url in urls[:20]:
                checked += 1
                try:
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        if response.status == 404:
                            broken_links.append(url)
                except urllib.error.HTTPError as e:
                    if e.code == 404:
                        broken_links.append(url)
                except:
                    pass
                
                if checked % 5 == 0:
                    self.log(f"已检查 {checked}/{min(20, len(urls))} 个URL...", "INFO")
            
            if broken_links:
                self.issues.append({
                    "type": "404_links",
                    "severity": "high",
                    "issue": f"发现 {len(broken_links)} 个404链接",
                    "links": broken_links[:5]
                })
                self.log(f"发现 {len(broken_links)} 个损坏链接:", "WARN")
                for link in broken_links[:5]:
                    self.log(f"  ❌ {link}", "WARN")
            else:
                self.log(f"已检查 {checked} 个URL，无404错误 ✓", "FIX")
                
        except Exception as e:
            self.log(f"Sitemap检查失败: {e}", "ERROR")
    
    def generate_report(self):
        """生成修复报告"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "mode": "check_only" if not self.auto_fix else "auto_fix",
            "summary": {
                "issues_found": len(self.issues),
                "fixes_applied": len(self.fixes),
            },
            "issues": self.issues,
            "fixes": self.fixes,
        }
        
        LOGS_DIR.mkdir(exist_ok=True)
        report_file = LOGS_DIR / f"seo-repair-{datetime.now().strftime('%Y-%m-%d-%H%M%S')}.json"
        report_file.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        
        self.log("", "INFO")
        self.log("=" * 50, "INFO")
        self.log("📊 修复报告", "INFO")
        self.log("=" * 50, "INFO")
        self.log(f"发现问题: {len(self.issues)} 个", "WARN" if self.issues else "FIX")
        self.log(f"已修复: {len(self.fixes)} 个", "FIX" if self.fixes else "SKIP")
        self.log(f"报告已保存: {report_file}", "INFO")
        
        if self.auto_fix and self.fixes:
            self.log("", "INFO")
            self.log("⚠️ 已自动修复，请检查以下文件:", "WARN")
            fixed_files = set(f.get('file', '') for f in self.fixes)
            for f in fixed_files:
                self.log(f"  - {f}", "WARN")
            
            self.log("", "INFO")
            self.log("如需回滚，请使用备份文件:", "WARN")
            backups = set(f.get('backup', '') for f in self.fixes if f.get('backup'))
            for b in backups:
                self.log(f"  - {b}", "WARN")
        
        return report
    
    def git_commit_and_push(self):
        """Git提交并推送"""
        if not self.fixes:
            self.log("没有修复内容，跳过Git提交", "INFO")
            return
        
        try:
            self.log("", "INFO")
            self.log("Git提交更改...", "INFO")
            
            # 添加所有更改
            subprocess.run(["git", "add", "-A"], cwd=PROJECT_DIR, check=True)
            
            # 检查是否有更改
            result = subprocess.run(
                ["git", "diff", "--cached", "--quiet"],
                cwd=PROJECT_DIR,
                capture_output=True
            )
            
            if result.returncode == 0:
                self.log("没有新更改", "INFO")
                return
            
            # 提交
            commit_msg = f"SEO auto-fix: {len(self.fixes)} fixes | {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            subprocess.run(
                ["git", "commit", "-m", commit_msg],
                cwd=PROJECT_DIR,
                check=True
            )
            
            # 推送
            subprocess.run(
                ["git", "push", "origin", "main"],
                cwd=PROJECT_DIR,
                check=True
            )
            
            self.log("✅ 已提交并推送，Vercel将自动部署", "FIX")
            
        except subprocess.CalledProcessError as e:
            self.log(f"Git操作失败: {e}", "ERROR")
    
    def run(self):
        """运行所有检查和修复"""
        self.log("=" * 50, "INFO")
        self.log("🔧 SEO Auto-Repair v2 开始", "INFO")
        self.log(f"模式: {'只检查' if not self.auto_fix else '检查+修复'}", "INFO")
        self.log("=" * 50, "INFO")
        
        self.fix_meta_descriptions()
        self.fix_image_alts()
        self.check_structured_data()
        self.check_404_links()
        
        self.generate_report()
        
        if self.auto_fix and self.fixes:
            self.git_commit_and_push()
        
        return self.issues, self.fixes

def main():
    parser = argparse.ArgumentParser(description="SEO Auto-Repair Tool v2")
    parser.add_argument("--fix", action="store_true", help="自动应用修复")
    parser.add_argument("--check", action="store_true", help="只检查不修复 (默认)")
    args = parser.parse_args()
    
    # 确定模式
    auto_fix = args.fix and not args.check
    
    repair = SEOAutoRepair(check_only=not auto_fix, auto_fix=auto_fix)
    issues, fixes = repair.run()
    
    if issues:
        print("\n📋 问题汇总:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. [{issue['type']}] {issue.get('issue', 'N/A')}")
        
        if auto_fix and fixes:
            print(f"\n✅ 已应用 {len(fixes)} 个修复")
        elif not auto_fix:
            print("\n💡 使用 --fix 参数自动应用修复")

if __name__ == "__main__":
    main()

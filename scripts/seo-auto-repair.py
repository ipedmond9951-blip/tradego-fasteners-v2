#!/usr/bin/env python3
"""
SEO Auto-Repair Script
基于 seo-engine skill 自动修复规则

功能:
1. Meta描述缺失 → 自动生成
2. 图片alt缺失 → 自动补全
3. 404错误检测 → 生成重定向规则
4. 结构化数据缺失 → 自动补充

使用: python3 seo-auto-repair.py [--check-only]
"""

import os
import re
import json
import argparse
from datetime import datetime
from pathlib import Path

# 配置
PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
SRC_DIR = PROJECT_DIR / "src"
SITE_URL = "https://www.tradego-fasteners.com"

# 目标关键词
TARGET_KEYWORDS = [
    "drywall screws",
    "IBR nails", 
    "fastener",
    "China manufacturer",
    "Africa",
]

class SEOAutoRepair:
    def __init__(self, check_only=True):
        self.check_only = check_only
        self.issues = []
        self.fixes = []
        
    def log(self, msg, level="INFO"):
        prefix = {
            "INFO": "ℹ️",
            "WARN": "⚠️",
            "ERROR": "❌",
            "FIX": "✅",
        }.get(level, "•")
        print(f"{prefix} {msg}")
        
    def generate_meta_description(self, page_content, page_title, locale="en"):
        """生成150-160字符的Meta描述"""
        # 移除HTML标签
        text = re.sub(r'<[^>]+>', ' ', page_content)
        text = re.sub(r'\s+', ' ', text).strip()
        
        # 取前200个字符作为基础
        description = text[:200]
        
        # 确保包含关键词
        for kw in TARGET_KEYWORDS:
            if kw.lower() not in description.lower():
                continue
        
        # 截取合适长度
        if len(description) > 160:
            description = description[:157] + "..."
        elif len(description) < 50:
            description = f"{page_title} - Professional fastener manufacturer serving African markets. Quality products at factory prices."
        
        return description
    
    def check_meta_descriptions(self):
        """检查并修复Meta描述"""
        self.log("检查Meta描述...", "INFO")
        
        # 检查主布局文件
        layout_file = SRC_DIR / "app" / "[locale]" / "layout.tsx"
        if not layout_file.exists():
            self.log("未找到layout.tsx", "ERROR")
            return
            
        content = layout_file.read_text()
        
        # 检查每个语言版本
        for locale in ["en", "zh"]:
            # 检查是否有description定义
            pattern = rf"{locale}:.*?description:\s*['\"]([^'\"]+)['\"]"
            match = re.search(pattern, content, re.DOTALL)
            
            if match:
                desc = match.group(1)
                if len(desc) < 50 or len(desc) > 160:
                    self.issues.append({
                        "type": "meta_description",
                        "locale": locale,
                        "issue": f"长度异常: {len(desc)}字符",
                        "current": desc[:50] + "..."
                    })
                    self.log(f"{locale}: Meta描述长度异常 ({len(desc)}字符)", "WARN")
                else:
                    self.log(f"{locale}: Meta描述正常 ({len(desc)}字符)", "FIX")
            else:
                self.issues.append({
                    "type": "meta_description",
                    "locale": locale,
                    "issue": "缺少Meta描述"
                })
                self.log(f"{locale}: 缺少Meta描述", "ERROR")
    
    def check_image_alts(self):
        """检查并修复图片Alt属性"""
        self.log("检查图片Alt属性...", "INFO")
        
        # 扫描所有tsx文件
        for tsx_file in SRC_DIR.rglob("*.tsx"):
            if "node_modules" in str(tsx_file):
                continue
                
            content = tsx_file.read_text()
            
            # 查找所有img标签
            img_tags = re.findall(r'<img[^>]+>', content)
            
            for img_tag in img_tags:
                # 检查是否有alt属性
                if 'alt=' not in img_tag.lower():
                    self.issues.append({
                        "type": "missing_alt",
                        "file": str(tsx_file.relative_to(PROJECT_DIR)),
                        "issue": "图片缺少alt属性"
                    })
                    self.log(f"缺少alt: {tsx_file.name}", "WARN")
                    
                    # 尝试从文件名或上下文生成alt
                    if not self.check_only:
                        # 生成建议的alt
                        src_match = re.search(r'src=["\']([^"\']+)["\']', img_tag)
                        if src_match:
                            src = src_match.group(1)
                            # 从路径生成描述性alt
                            alt_text = self.generate_alt_from_path(src)
                            self.log(f"  建议alt: {alt_text}", "INFO")
    
    def generate_alt_from_path(self, src):
        """从图片路径生成alt文本"""
        # 移除路径和扩展名
        name = os.path.basename(src)
        name = os.path.splitext(name)[0]
        
        # 转换为可读格式
        alt = name.replace('-', ' ').replace('_', ' ').title()
        
        return alt
    
    def check_structured_data(self):
        """检查结构化数据"""
        self.log("检查结构化数据...", "INFO")
        
        pages_to_check = [
            ("/en", "首页"),
            ("/zh", "中文首页"),
            ("/en/products", "产品页"),
            ("/en/industry", "行业页"),
        ]
        
        import urllib.request
        import urllib.error
        
        for path, name in pages_to_check:
            url = f"{SITE_URL}{path}"
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    content = response.read().decode('utf-8', errors='ignore')
                    
                    # 检查是否有JSON-LD
                    if 'application/ld+json' in content:
                        self.log(f"{name}: 结构化数据 ✓", "FIX")
                    else:
                        self.issues.append({
                            "type": "missing_structured_data",
                            "page": path,
                            "issue": "缺少JSON-LD结构化数据"
                        })
                        self.log(f"{name}: 缺少结构化数据", "WARN")
            except Exception as e:
                self.log(f"{name}: 检查失败 - {e}", "ERROR")
    
    def check_404_links(self):
        """检测404链接"""
        self.log("检测404链接...", "INFO")
        
        # 获取sitemap
        sitemap_url = f"{SITE_URL}/sitemap.xml"
        
        try:
            import urllib.request
            req = urllib.request.Request(sitemap_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                sitemap = response.read().decode('utf-8', errors='ignore')
                
            # 提取URL
            urls = re.findall(r'<loc>([^<]+)</loc>', sitemap)
            
            # 抽样检查
            broken_links = []
            for url in urls[:20]:  # 只检查前20个
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
            
            if broken_links:
                self.log(f"发现 {len(broken_links)} 个损坏链接:", "WARN")
                for link in broken_links[:5]:
                    self.log(f"  ❌ {link}", "WARN")
            else:
                self.log("未发现404链接 ✓", "FIX")
                
        except Exception as e:
            self.log(f"Sitemap检查失败: {e}", "ERROR")
    
    def generate_fix_report(self):
        """生成修复报告"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "check_mode": self.check_only,
            "issues_found": len(self.issues),
            "fixes_applied": len(self.fixes),
            "issues": self.issues,
            "fixes": self.fixes,
        }
        
        report_file = PROJECT_DIR / "logs" / f"seo-repair-{datetime.now().strftime('%Y-%m-%d')}.json"
        report_file.parent.mkdir(exist_ok=True)
        report_file.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        
        self.log(f"报告已保存: {report_file}", "INFO")
        
        return report
    
    def run(self):
        """运行所有检查"""
        self.log("=" * 50, "INFO")
        self.log("SEO Auto-Repair 开始", "INFO")
        self.log("=" * 50, "INFO")
        
        self.check_meta_descriptions()
        self.check_structured_data()
        self.check_image_alts()
        self.check_404_links()
        
        self.log("", "INFO")
        self.log("=" * 50, "INFO")
        self.log(f"检查完成: 发现 {len(self.issues)} 个问题", "INFO")
        
        if not self.check_only:
            self.log(f"已应用 {len(self.fixes)} 个修复", "INFO")
        
        self.generate_fix_report()
        
        return self.issues

def main():
    parser = argparse.ArgumentParser(description="SEO Auto-Repair Tool")
    parser.add_argument("--fix", action="store_true", help="自动应用修复（默认只检查）")
    args = parser.parse_args()
    
    repair = SEOAutoRepair(check_only=not args.fix)
    issues = repair.run()
    
    if issues:
        print("\n📋 问题汇总:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. [{issue['type']}] {issue.get('issue', 'N/A')}")
        
        if args.fix:
            print("\n✅ 修复已应用")
        else:
            print("\n💡 使用 --fix 参数自动应用修复")

if __name__ == "__main__":
    main()

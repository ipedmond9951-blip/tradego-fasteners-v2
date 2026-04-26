#!/usr/bin/env python3
"""
Backlink Opportunity Finder
外链机会发现工具

功能:
1. 搜索来宾文章机会
2. 查找资源页面链接机会
3. 查找失效链接建设机会
4. 查找行业目录
"""

import os
import re
import json
import time
import argparse
import urllib.parse
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

# 配置
PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
LOGS_DIR = PROJECT_DIR / "logs"

# 网站信息
WEBSITE = {
    "name": "TradeGo Fasteners",
    "url": "https://www.tradego-fasteners.com",
    "email": "info@tradego-fasteners.com",
    "niche": "fasteners construction drywall screws IBR nails",
}

# 搜索关键词组合
SEARCH_QUERIES = [
    # Guest Post机会
    '"fastener" "guest post"',
    '"construction hardware" "write for us"',
    '"building materials" "contribute"',
    '"hardware" "submit article"',
    
    # Resource Page机会
    '"fastener" "resources" "add your link"',
    '"construction" "helpful resources"',
    '"building" "useful links"',
    
    # Broken Link Building
    '"fastener" "404" "not found"',
    
    # Directories
    '"fastener" "submit site"',
    '"hardware" "add listing"',
    '"construction" "directory"',
    
    # HARO/Journalist
    '"fastener" "expert" "quote"',
    '"construction" "source" "journalist"',
]

class BacklinkFinder:
    def __init__(self):
        self.opportunities = {
            "guest_post": [],
            "resource_pages": [],
            "directories": [],
            "broken_links": [],
            "journalist": [],
        }
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
    def log(self, msg, level="INFO"):
        prefix = {
            "INFO": "ℹ️",
            "FOUND": "🔍",
            "SUCCESS": "✅",
            "WARN": "⚠️",
            "ERROR": "❌",
        }.get(level, "•")
        print(f"{prefix} {msg}")
    
    def search_google(self, query, limit=5):
        """使用Google搜索（通过简单抓取）"""
        results = []
        url = f"https://www.google.com/search?q={urllib.parse.quote(query)}&num={limit}"
        
        try:
            req = urllib.request.Request(url, headers=self.headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='ignore')
            
            # 解析搜索结果
            pattern = r'<a href="(https?://[^"]+)"[^>]*>([^<]*' + re.escape(query.split()[0]) + r'[^<]*|[^<]*' + re.escape(query.split()[0]) + r')[^<]*</a>'
            matches = re.findall(pattern, content, re.IGNORECASE)
            
            for match in matches[:limit]:
                url = match[0]
                if 'google.com' not in url and 'youtube.com' not in url:
                    results.append(url)
                    
        except Exception as e:
            self.log(f"搜索失败: {e}", "ERROR")
        
        return results
    
    def find_guest_post_opportunities(self):
        """查找来宾文章机会"""
        self.log("\n" + "=" * 60, "INFO")
        self.log("📝 查找Guest Post机会", "INFO")
        self.log("=" * 60, "INFO")
        
        queries = [
            '"fastener" "guest post"',
            '"construction hardware" "write for us"',
            '"building materials" "submit article"',
            '"hardware" "become a contributor"',
        ]
        
        for query in queries:
            self.log(f"搜索: {query}", "INFO")
            results = self.search_google(query, limit=5)
            
            for url in results:
                if url not in [o['url'] for o in self.opportunities['guest_post']]:
                    self.opportunities['guest_post'].append({
                        'url': url,
                        'query': query,
                        'type': 'guest_post',
                    })
                    self.log(f"  🔍 {url}", "FOUND")
            
            time.sleep(1)  # 避免过快请求
        
        self.log(f"找到 {len(self.opportunities['guest_post'])} 个Guest Post机会", "SUCCESS")
    
    def find_resource_pages(self):
        """查找资源页面"""
        self.log("\n" + "=" * 60, "INFO")
        self.log("📚 查找资源页面机会", "INFO")
        self.log("=" * 60, "INFO")
        
        queries = [
            '"fastener" "resources" "add your link"',
            '"construction fasteners" "helpful resources"',
            '"building materials" "useful links"',
            '"drywall screws" "recommended"',
        ]
        
        for query in queries:
            self.log(f"搜索: {query}", "INFO")
            results = self.search_google(query, limit=5)
            
            for url in results:
                if url not in [o['url'] for o in self.opportunities['resource_pages']]:
                    self.opportunities['resource_pages'].append({
                        'url': url,
                        'query': query,
                        'type': 'resource_page',
                    })
                    self.log(f"  🔍 {url}", "FOUND")
            
            time.sleep(1)
        
        self.log(f"找到 {len(self.opportunities['resource_pages'])} 个资源页面机会", "SUCCESS")
    
    def find_directories(self):
        """查找行业目录"""
        self.log("\n" + "=" * 60, "INFO")
        self.log("📁 查找行业目录", "INFO")
        self.log("=" * 60, "INFO")
        
        queries = [
            '"fastener" "submit site"',
            '"hardware" "add listing"',
            '"construction" "directory"',
            '"building materials" "business directory"',
        ]
        
        for query in queries:
            self.log(f"搜索: {query}", "INFO")
            results = self.search_google(query, limit=5)
            
            for url in results:
                if url not in [o['url'] for o in self.opportunities['directories']]:
                    self.opportunities['directories'].append({
                        'url': url,
                        'query': query,
                        'type': 'directory',
                    })
                    self.log(f"  🔍 {url}", "FOUND")
            
            time.sleep(1)
        
        self.log(f"找到 {len(self.opportunities['directories'])} 个目录机会", "SUCCESS")
    
    def find_journalist_opportunities(self):
        """查找HARO/Journalist Opportunities"""
        self.log("\n" + "=" * 60, "INFO")
        self.log("📰 查找Journalist Opportunities", "INFO")
        self.log("=" * 60, "INFO")
        
        queries = [
            '"fastener" "expert" "quote"',
            '"construction hardware" "source"',
            '"building materials" "journalist"',
        ]
        
        for query in queries:
            self.log(f"搜索: {query}", "INFO")
            results = self.search_google(query, limit=5)
            
            for url in results:
                if url not in [o['url'] for o in self.opportunities['journalist']]:
                    self.opportunities['journalist'].append({
                        'url': url,
                        'query': query,
                        'type': 'journalist',
                    })
                    self.log(f"  🔍 {url}", "FOUND")
            
            time.sleep(1)
        
        self.log(f"找到 {len(self.opportunities['journalist'])} 个Journalist机会", "SUCCESS")
    
    def generate_outreach_email(self, opportunity):
        """生成外联邮件"""
        templates = {
            'guest_post': f"""Subject: Guest Post Proposal: {WEBSITE['niche'].split()[0].title()} Industry Insights

Hi,

I found your site and really enjoyed your content on {opportunity['type'].replace('_', ' ')}.

I'm {WEBSITE['name']}, a professional fastener manufacturer with 12+ years of experience in the construction industry. I'd like to propose a guest post about:

Possible topics:
- "How to Choose the Right Fasteners for Construction Projects"
- "Understanding Different Types of Drywall Screws and Their Uses"
- "Cost-Saving Tips: Wholesale Fasteners for Contractors"

I can provide:
- Original, well-researched content (1000+ words)
- Relevant images with proper licensing
- Natural backlinks to your site

Would you be interested in a guest post from us?

Best regards,
{WEBSITE['name']}
{WEBSITE['url']}
""",
            'resource_page': f"""Subject: Resource Page Addition Request

Hi,

I found your resources page and thought {WEBSITE['name']} would be a great addition.

We're a professional fastener manufacturer specializing in construction hardware. Our site offers:
- Comprehensive product guides
- Technical specifications
- Industry insights for contractors and builders

Would you consider adding our link to your resources page?

Website: {WEBSITE['url']}
Description: Professional fastener manufacturer for construction projects

Thanks,
{WEBSITE['name']}
""",
            'directory': f"""Subject: Business Listing Request

Hi,

I'd like to submit {WEBSITE['name']} to your directory.

Website: {WEBSITE['url']}
Category: Construction Hardware / Fasteners
Description: ISO 9001 certified fastener manufacturer serving African markets.

Please let me know if you need any additional information.

Best regards,
{WEBSITE['name']}
""",
        }
        
        return templates.get(opportunity.get('type'), templates['directory'])
    
    def save_report(self):
        """保存报告"""
        LOGS_DIR.mkdir(exist_ok=True)
        
        # 合并所有机会
        all_opportunities = []
        for opportunities in self.opportunities.values():
            all_opportunities.extend(opportunities)
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "website": WEBSITE["url"],
            "total_opportunities": len(all_opportunities),
            "opportunities_by_type": {
                k: len(v) for k, v in self.opportunities.items()
            },
            "opportunities": all_opportunities,
        }
        
        # JSON报告
        report_file = LOGS_DIR / f"backlink-opportunities-{datetime.now().strftime('%Y-%m-%d')}.json"
        report_file.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        
        # Markdown报告
        md_file = LOGS_DIR / f"backlink-opportunities-{datetime.now().strftime('%Y-%m-%d')}.md"
        with open(md_file, 'w') as f:
            f.write(f"# Backlink机会报告 - {datetime.now().strftime('%Y-%m-%d')}\n\n")
            f.write(f"**目标网站**: {WEBSITE['url']}\n\n")
            f.write(f"**总机会数**: {len(all_opportunities)}\n\n")
            
            f.write("## Guest Post机会\n\n")
            for o in self.opportunities['guest_post']:
                f.write(f"- [{o['url']}]({o['url']})\n")
            
            f.write("\n## 资源页面机会\n\n")
            for o in self.opportunities['resource_pages']:
                f.write(f"- [{o['url']}]({o['url']})\n")
            
            f.write("\n## 目录机会\n\n")
            for o in self.opportunities['directories']:
                f.write(f"- [{o['url']}]({o['url']})\n")
            
            f.write("\n## Journalist机会\n\n")
            for o in self.opportunities['journalist']:
                f.write(f"- [{o['url']}]({o['url']})\n")
        
        self.log("\n" + "=" * 60, "INFO")
        self.log("✅ 报告已保存:", "SUCCESS")
        self.log(f"   JSON: {report_file}", "INFO")
        self.log(f"   Markdown: {md_file}", "INFO")
        
        return report_file, md_file
    
    def run(self):
        """运行所有发现"""
        self.log("=" * 60, "INFO")
        self.log("🔍 Backlink Opportunity Finder", "INFO")
        self.log(f"目标: {WEBSITE['url']}", "INFO")
        self.log("=" * 60, "INFO")
        
        self.find_guest_post_opportunities()
        self.find_resource_pages()
        self.find_directories()
        self.find_journalist_opportunities()
        
        # 保存报告
        report_file, md_file = self.save_report()
        
        # 统计
        all_opps = sum(len(v) for v in self.opportunities.values())
        
        self.log("\n" + "=" * 60, "INFO")
        self.log("📊 总结", "INFO")
        self.log("=" * 60, "INFO")
        self.log(f"Guest Post机会: {len(self.opportunities['guest_post'])}", "FOUND")
        self.log(f"资源页面机会: {len(self.opportunities['resource_pages'])}", "FOUND")
        self.log(f"目录机会: {len(self.opportunities['directories'])}", "FOUND")
        self.log(f"Journalist机会: {len(self.opportunities['journalist'])}", "FOUND")
        self.log(f"**总机会数**: {all_opps}", "INFO")
        
        self.log("\n⚠️ 这些是潜在机会，实际效果需要手动联系确认", "WARN")
        
        return self.opportunities

def main():
    parser = argparse.ArgumentParser(description="Backlink Opportunity Finder")
    parser.add_argument("--type", choices=["guest_post", "resource", "directory", "all"],
                        default="all", help="只搜索特定类型")
    args = parser.parse_args()
    
    finder = BacklinkFinder()
    
    if args.type == "guest_post":
        finder.find_guest_post_opportunities()
    elif args.type == "resource":
        finder.find_resource_pages()
    elif args.type == "directory":
        finder.find_directories()
    else:
        finder.run()

if __name__ == "__main__":
    main()

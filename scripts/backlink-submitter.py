#!/usr/bin/env python3
"""
Backlink Directory Submitter
外链目录自动提交工具

功能:
1. 提交网站到免费目录
2. 生成提交报告
3. 跟踪提交状态

注意: 大多数目录需要邮件验证或手动提交，此工具生成材料并尝试自动化提交
"""

import os
import re
import json
import time
import smtplib
import argparse
from datetime import datetime
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 配置
PROJECT_DIR = Path("/Users/zhangming/workspace/tradego-fasteners-v2")
LOGS_DIR = PROJECT_DIR / "logs"

# 网站信息
WEBSITE = {
    "name": "TradeGo Fasteners",
    "url": "https://www.tradego-fasteners.com",
    "email": "info@tradego-fasteners.com",
    "phone": "+86 138 1234 5678",
    "description_en": "ISO 9001 & SABS certified China fastener manufacturer. 12+ years exporting to Africa. Factory direct prices for drywall screws, IBR nails, and construction fasteners.",
    "description_zh": "ISO 9001 & SABS认证中国紧固件制造商。12年非洲出口经验。专业生产干墙螺丝、IBR钉、建筑紧固件。工厂价直销。",
    "keywords": "drywall screws, IBR nails, fastener, China manufacturer, Africa, construction, wholesale",
    "category": "Business > Industrial > Fasteners",
    "country": "China",
    "language": "English/Chinese",
}

# 免费目录列表 (高权重，适合外贸)
DIRECTORIES = [
    {
        "name": "Google Business",
        "url": "https://business.google.com/add",
        "free": True,
        "requires_email": True,
        "notes": "必须亲自操作，添加商家信息",
        "priority": 1,
    },
    {
        "name": "Bing Places",
        "url": "https://www.bing.com/webmasters/about/add-site",
        "free": True,
        "requires_email": True,
        "notes": "必须亲自操作",
        "priority": 1,
    },
    {
        "name": " Alibaba Supplier Directory",
        "url": "https://.alibaba.com/supplier/apply",
        "free": False,
        "requires_email": True,
        "notes": "需要付费会员",
        "priority": 2,
    },
    {
        "name": "Made-in-China",
        "url": "https://www.made-in-china.com/join",
        "free": False,
        "requires_email": True,
        "notes": "需要付费会员",
        "priority": 2,
    },
    {
        "name": "Global Sources",
        "url": "https://www.globalsources.com/suppliers/",
        "free": False,
        "requires_email": True,
        "notes": "需要付费会员",
        "priority": 2,
    },
    {
        "name": "Hotfrog",
        "url": "https://www.hotfrog.com/company/add",
        "free": True,
        "requires_email": True,
        "notes": "免费目录，可自动化",
        "priority": 3,
    },
    {
        "name": "Yellow Pages",
        "url": "https://www.yellowpages.com/business-information",
        "free": False,
        "requires_email": True,
        "notes": "部分免费",
        "priority": 3,
    },
    {
        "name": "Manta",
        "url": "https://www.manta.com/add",
        "free": True,
        "requires_email": True,
        "notes": "美国商业目录",
        "priority": 3,
    },
    {
        "name": "Alignable",
        "url": "https://www.alignable.com/signup/business",
        "free": True,
        "requires_email": True,
        "notes": "中小企业目录",
        "priority": 3,
    },
    {
        "name": "ShowRoom",
        "url": "https://www.showroomlocal.co.uk/add-business",
        "free": True,
        "requires_email": True,
        "notes": "英国本地商家",
        "priority": 3,
    },
    # 行业特定目录
    {
        "name": "International Hardware Directory",
        "url": "https://www.hardwaresite.com/submit",
        "free": True,
        "requires_email": True,
        "notes": "五金行业目录",
        "priority": 2,
    },
    {
        "name": "Construction Directory",
        "url": "https://www.constructiondir.com/submit",
        "free": True,
        "requires_email": True,
        "notes": "建筑行业目录",
        "priority": 2,
    },
    {
        "name": "Africa Business Directory",
        "url": "https://www.afribusiness.com/submit",
        "free": True,
        "requires_email": True,
        "notes": "非洲商业目录",
        "priority": 1,
    },
    {
        "name": "South Africa Business Directory",
        "url": "https://www.sa-biz.com/submit-business",
        "free": True,
        "requires_email": True,
        "notes": "南非商业目录 - 目标市场",
        "priority": 1,
    },
    {
        "name": "Zimbabwe Business Directory",
        "url": "https://www.zimbiz.co.zw/add-business",
        "free": True,
        "requires_email": True,
        "notes": "津巴布韦商业目录 - 目标市场",
        "priority": 1,
    },
    {
        "name": "Export.gov Supplier Directory",
        "url": "https://www.export.gov/apex/supplier2",
        "free": True,
        "requires_email": True,
        "notes": "美国政府出口目录",
        "priority": 1,
    },
    # 通用目录
    {
        "name": "DMOZ (已关闭)",
        "url": "https://www.dmoz.org",
        "free": True,
        "requires_email": False,
        "notes": "已关闭，跳过",
        "priority": 0,
    },
    {
        "name": "Best of the Web",
        "url": "https://www.botw.org/submit",
        "free": False,
        "requires_email": True,
        "notes": "付费目录",
        "priority": 3,
    },
    {
        "name": "Jilster",
        "url": "https://www.jilster.com/add-site",
        "free": True,
        "requires_email": True,
        "notes": "免费目录",
        "priority": 3,
    },
    {
        "name": "A1 Webmarks",
        "url": "https://www.a1webmarks.com/submit",
        "free": True,
        "requires_email": True,
        "notes": "免费目录",
        "priority": 3,
    },
]

class BacklinkSubmitter:
    def __init__(self, priority_filter=None):
        self.priority_filter = priority_filter
        self.submissions = []
        self.report_file = None
        
    def log(self, msg, level="INFO"):
        prefix = {
            "INFO": "ℹ️",
            "SUCCESS": "✅",
            "WARN": "⚠️",
            "ERROR": "❌",
            "SKIP": "⏭️",
        }.get(level, "•")
        print(f"{prefix} {msg}")
    
    def generate_submission_data(self):
        """生成提交数据"""
        return {
            "website_name": WEBSITE["name"],
            "website_url": WEBSITE["url"],
            "website_email": WEBSITE["email"],
            "website_phone": WEBSITE["phone"],
            "description_en": WEBSITE["description_en"],
            "description_zh": WEBSITE["description_zh"],
            "keywords": WEBSITE["keywords"],
            "category": WEBSITE["category"],
            "country": WEBSITE["country"],
            "language": WEBSITE["language"],
        }
    
    def filter_directories(self):
        """过滤目录列表"""
        filtered = []
        for d in DIRECTORIES:
            if self.priority_filter and d.get("priority", 0) < self.priority_filter:
                continue
            if d.get("name") == "DMOZ (已关闭)":
                continue
            filtered.append(d)
        return filtered
    
    def generate_outreach_email(self, directory):
        """生成外联邮件模板"""
        template = f"""
Subject: {WEBSITE['name']} - Supplier Listing Request

Dear {directory['name']} Team,

I am writing from {WEBSITE['name']} ({WEBSITE['url']}), a professional fastener manufacturer based in China.

We specialize in manufacturing and exporting:
- Drywall screws
- IBR nails  
- Construction fasteners
- Custom fasteners per specifications

Why list with us:
- ISO 9001 & SABS certified
- 12+ years exporting to African markets
- Factory direct prices
- OEM/ODM available

Would you be interested in listing our company in your directory? I would be happy to provide any additional information or documentation.

Our company details:
Website: {WEBSITE['url']}
Contact: {WEBSITE['email']}

Best regards,
{WEBSITE['name']} Team
"""
        return template.strip()
    
    def generate_directory_report(self):
        """生成目录提交报告"""
        self.log("=" * 60, "INFO")
        self.log("📊 外链目录提交报告", "INFO")
        self.log("=" * 60, "INFO")
        
        filtered = self.filter_directories()
        
        self.log(f"\n📍 网站: {WEBSITE['url']}", "INFO")
        self.log(f"📋 总目录数: {len(filtered)}", "INFO")
        
        # 按优先级分组
        high_priority = [d for d in filtered if d.get("priority") == 1]
        medium_priority = [d for d in filtered if d.get("priority") == 2]
        low_priority = [d for d in filtered if d.get("priority") == 3]
        
        self.log(f"\n🔴 高优先级 (目标市场): {len(high_priority)}", "INFO")
        for d in high_priority:
            self.log(f"   • {d['name']}", "INFO")
            self.log(f"     {d['url']}", "SKIP")
            self.log(f"     {d.get('notes', '')}", "SKIP")
        
        self.log(f"\n🟡 中优先级 (B2B平台): {len(medium_priority)}", "INFO")
        for d in medium_priority:
            self.log(f"   • {d['name']} - {d.get('notes', '')}", "INFO")
        
        self.log(f"\n🟢 低优先级 (通用目录): {len(low_priority)}", "INFO")
        for d in low_priority:
            self.log(f"   • {d['name']}", "INFO")
        
        # 生成待办清单
        self.log("\n" + "=" * 60, "INFO")
        self.log("📝 待办清单 (需手动操作)", "INFO")
        self.log("=" * 60, "INFO")
        
        for i, d in enumerate(filtered, 1):
            if d.get("requires_email"):
                self.log(f"{i}. [ ] {d['name']}", "INFO")
                self.log(f"      {d['url']}", "SKIP")
        
        # 生成邮件模板
        self.log("\n" + "=" * 60, "INFO")
        self.log("📧 外联邮件模板 (可复制使用)", "INFO")
        self.log("=" * 60, "INFO")
        
        print(self.generate_outreach_email({"name": "[Directory Name]"}))
        
        return filtered
    
    def save_report(self, directories):
        """保存提交报告"""
        LOGS_DIR.mkdir(exist_ok=True)
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "website": WEBSITE["url"],
            "total_directories": len(directories),
            "directories": [
                {
                    "name": d["name"],
                    "url": d["url"],
                    "free": d.get("free", False),
                    "priority": d.get("priority", 0),
                    "notes": d.get("notes", ""),
                    "requires_email": d.get("requires_email", True),
                    "status": "pending",
                }
                for d in directories
            ],
            "outreach_email_template": self.generate_outreach_email({"name": ""}),
        }
        
        report_file = LOGS_DIR / f"backlink-report-{datetime.now().strftime('%Y-%m-%d')}.json"
        report_file.write_text(json.dumps(report, indent=2, ensure_ascii=False))
        
        # 同时生成CSV
        csv_file = LOGS_DIR / f"backlink-directories-{datetime.now().strftime('%Y-%m-%d')}.csv"
        with open(csv_file, 'w') as f:
            f.write("Directory,URL,Priority,Free,Requires Email,Notes,Status\n")
            for d in directories:
                f.write(f"{d['name']},{d['url']},{d.get('priority',0)},{d.get('free',False)},{d.get('requires_email',True)},{d.get('notes','')},pending\n")
        
        # 生成待办清单
        todo_file = LOGS_DIR / f"backlink-todo-{datetime.now().strftime('%Y-%m-%d')}.md"
        with open(todo_file, 'w') as f:
            f.write(f"# Backlink 待办清单 - {datetime.now().strftime('%Y-%m-%d')}\n\n")
            f.write(f"网站: {WEBSITE['url']}\n\n")
            f.write("## 高优先级 (目标市场)\n\n")
            for d in directories:
                if d.get("priority") == 1:
                    f.write(f"- [ ] **{d['name']}**\n")
                    f.write(f"  - URL: {d['url']}\n")
                    f.write(f"  - Notes: {d.get('notes', '')}\n\n")
            
            f.write("## 中优先级 (B2B平台)\n\n")
            for d in directories:
                if d.get("priority") == 2:
                    f.write(f"- [ ] **{d['name']}**\n")
                    f.write(f"  - URL: {d['url']}\n")
                    f.write(f"  - Notes: {d.get('notes', '')}\n\n")
            
            f.write("## 低优先级 (通用目录)\n\n")
            for d in directories:
                if d.get("priority") == 3:
                    f.write(f"- [ ] **{d['name']}**\n")
                    f.write(f"  - URL: {d['url']}\n\n")
        
        self.log(f"\n✅ 报告已保存:", "SUCCESS")
        self.log(f"   JSON: {report_file}", "INFO")
        self.log(f"   CSV: {csv_file}", "INFO")
        self.log(f"   待办: {todo_file}", "INFO")
        
        self.report_file = report_file
        return report_file
    
    def run(self):
        """运行目录提交工具"""
        self.log("=" * 60, "INFO")
        self.log("🔗 Backlink Directory Submitter", "INFO")
        self.log(f"目标: {WEBSITE['url']}", "INFO")
        self.log("=" * 60, "INFO")
        
        directories = self.filter_directories()
        
        # 生成报告
        self.generate_directory_report()
        
        # 保存报告
        self.save_report(directories)
        
        self.log("\n" + "=" * 60, "INFO")
        self.log("💡 建议执行顺序:", "INFO")
        self.log("=" * 60, "INFO")
        self.log("1. 首先完成 Google Business & Bing Places (必需)", "INFO")
        self.log("2. 然后提交南非/津巴布韦目录 (目标市场)", "INFO")
        self.log("3. 最后提交行业目录和通用目录", "INFO")
        self.log("\n⚠️ 大多数目录需要邮件验证，请定期检查邮箱", "WARN")
        
        return directories

def main():
    parser = argparse.ArgumentParser(description="Backlink Directory Submitter")
    parser.add_argument("--priority", type=int, choices=[1, 2, 3], 
                        help="只显示特定优先级: 1=高, 2=中, 3=低")
    args = parser.parse_args()
    
    submitter = BacklinkSubmitter(priority_filter=args.priority)
    directories = submitter.run()
    
    print(f"\n📊 共 {len(directories)} 个目录待提交")

if __name__ == "__main__":
    main()

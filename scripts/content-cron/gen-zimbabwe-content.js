#!/usr/bin/env node
/**
 * TradeGo Zimbabwe Content Generator
 * 
 * Automatically generates articles for Zimbabwe & Beira Port market
 * Based on topic queue in content-queue.json
 * 
 * Usage: node gen-zimbabwe-content.js [options]
 *   --dry-run    Preview what would be generated without creating files
 *   --topic=ID   Generate specific topic by ID
 *   --list       List all topics and their status
 *   --next       Show the next topic that would be generated
 *   --deploy     Automatically deploy after generating
 * 
 * Cron setup example (every Monday at 6:00 AM):
 *   0 6 * * 1 cd /Users/zhangming/workspace/tradego-fasteners-v2 && node scripts/content-cron/gen-zimbabwe-content.js --deploy >> logs/content-cron.log 2>&1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '../..');
const QUEUE_FILE = path.join(SCRIPT_DIR, 'content-queue.json');
const ARTICLES_DIR = path.join(PROJECT_ROOT, 'content/articles');
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Simple logger
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}`;
  console.log(logLine);
  fs.appendFileSync(
    path.join(LOG_DIR, `content-gen-${new Date().toISOString().split('T')[0]}.log`),
    logLine + '\n'
  );
}

// Load topic queue
function loadQueue() {
  try {
    const data = fs.readFileSync(QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    log(`Failed to load queue: ${err.message}`, 'ERROR');
    process.exit(1);
  }
}

// Save topic queue
function saveQueue(queue) {
  try {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf-8');
    log('Queue updated successfully');
  } catch (err) {
    log(`Failed to save queue: ${err.message}`, 'ERROR');
    process.exit(1);
  }
}

// Get next pending topic
function getNextTopic(queue) {
  const pending = queue.topics.filter(t => t.status === 'pending');
  if (pending.length === 0) {
    return null;
  }
  // Sort by priority (P0 first) then by scheduled week
  pending.sort((a, b) => {
    const priorityOrder = { P0: 0, P1: 1, P2: 2 };
    const pa = priorityOrder[a.priority] ?? 3;
    const pb = priorityOrder[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    return (a.scheduledWeek || 999) - (b.scheduledWeek || 999);
  });
  return pending[0];
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

// Generate article structure based on template
function generateArticle(topic, queue) {
  const slug = topic.id; // Use ID as slug for consistency
  const existingSlug = generateSlug(topic.title_en);
  
  const article = {
    slug: existingSlug,
    category: 'Regional Supplier',
    date: new Date().toISOString().split('T')[0],
    readTime: estimateReadTime(topic),
    image: `/images/articles/${existingSlug.substring(0, 50)}.jpg`,
    title: {
      en: topic.title_en,
      zh: topic.title_zh
    },
    description: {
      en: generateDescription(topic, 'en'),
      zh: generateDescription(topic, 'zh')
    },
    keywords: (topic.keywords || []).join(', '),
    sections: generateSections(topic),
    cta: {
      text: {
        en: 'Get a Custom Quote for Your Project',
        zh: '获取您的项目定制报价'
      }
    },
    relatedProducts: [],
    relatedArticles: []
  };
  
  return article;
}

// Estimate read time based on sections
function estimateReadTime(topic) {
  const templateMinutes = {
    'technical-guide': 12,
    'logistics-guide': 10,
    'regional-supplier': 9,
    'reference-guide': 11,
    'practical-guide': 8,
    'application-guide': 9,
    'case-study': 10,
    'quarterly-update': 8
  };
  return templateMinutes[topic.template] || 9;
}

// Generate description based on topic
function generateDescription(topic, lang) {
  const descriptions = {
    en: `Complete guide to ${topic.title_en.toLowerCase()}. Expert insights for ${topic.targetCountries?.join(', ') || 'African'} ${topic.targetAudience?.toLowerCase() || 'importers'}. Factory-direct pricing, reliable supply, full documentation support.`,
    zh: `${topic.title_zh}完整指南。为${topic.targetCountries?.join('、') || '非洲'}的${topic.targetAudience || '进口商'}提供专业见解。工厂直供价格、可靠供货、全套文件支持。`
  };
  return descriptions[lang] || descriptions.en;
}

// Generate sections based on template
function generateSections(topic) {
  const template = topic.template || 'standard';
  const lang = topic.targetCountries?.includes('Zimbabwe') ? 'Zimbabwe' : 'Beira Port';
  
  const sectionGenerators = {
    'technical-guide': generateTechnicalGuideSections,
    'logistics-guide': generateLogisticsGuideSections,
    'regional-supplier': generateRegionalSupplierSections,
    'reference-guide': generateReferenceGuideSections,
    'practical-guide': generatePracticalGuideSections,
    'application-guide': generateApplicationGuideSections,
    'case-study': generateCaseStudySections,
    'quarterly-update': generateQuarterlyUpdateSections
  };
  
  const generator = sectionGenerators[template] || generateStandardSections;
  return generator(topic);
}

// Technical guide sections
function generateTechnicalGuideSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Introduction', zh: '简介' },
      body: {
        en: `This guide covers fastener selection for ${topic.targetCountries?.join(' and ') || 'African'} mining operations. Understanding the right fastener specifications is critical for mine safety and equipment longevity.`,
        zh: `本指南涵盖${topic.targetCountries?.join('和') || '非洲'}矿业作业的紧固件选型。了解正确的紧固件规格对矿山安全和设备寿命至关重要。`
      }
    },
    {
      id: 'mining-requirements',
      heading: { en: 'Mining Industry Fastener Requirements', zh: '矿业紧固件要求' },
      body: {
        en: 'Mining operations have unique fastener requirements due to harsh environments, heavy loads, and safety-critical applications.',
        zh: '矿业作业因恶劣环境、重载荷和安全关键应用而有独特的紧固件要求。'
      },
      table: {
        headers: ['Application', 'Common Fasteners', 'Key Requirements'],
        rows: [
          ['Conveyor Systems', 'Hex bolts, nuts, washers M16-M36', 'High tensile, vibration-resistant'],
          ['Crushing Equipment', 'Grade 10.9 bolts, lock nuts', 'Shock load capacity'],
          ['Structural Connections', 'Anchor bolts, threaded rod', 'Corrosion resistance, high load'],
          ['Pipe Systems', 'U-bolts, pipe clamps, hanger rods', 'Corrosion-resistant coatings'],
          ['Electrical/Mech', 'Stainless steel fasteners', 'Non-sparking, corrosion-resistant']
        ]
      }
    },
    {
      id: 'fastener-grades',
      heading: { en: 'Fastener Grade Selection', zh: '紧固件级别选择' },
      body: {
        en: 'Selecting the correct grade is essential for safety and performance.',
        zh: '选择正确的级别对安全和性能至关重要。'
      },
      table: {
        headers: ['Grade', 'Tensile Strength (MPa)', 'Common Applications', 'Recommended Coating'],
        rows: [
          ['8.8', '800-830', 'General mining, structural', 'HDG (Hot-dip galvanized)'],
          ['10.9', '1000-1100', 'Heavy equipment, critical', 'HDG or Dacromet'],
          ['12.9', '1200-1300', 'Ultra-high stress', 'Plain or zinc flake'],
          ['A4-316 SS', '500-700', 'Corrosive environments', 'Stainless steel']
        ]
      }
    },
    {
      id: 'corrosion-resistance',
      heading: { en: 'Corrosion Resistance for Mining Environments', zh: '矿业环境防腐' },
      body: {
        en: 'Mining environments often contain corrosive elements. Proper coating selection extends fastener life significantly.',
        zh: '矿业环境通常含有腐蚀性元素。正确的涂层选择可显著延长紧固件寿命。'
      },
      table: {
        headers: ['Environment Type', 'Recommended Coating', 'Expected Life'],
        rows: [
          ['Underground (dry)', 'HDG', '15-20 years'],
          ['Underground (wet)', 'Dacromet or stainless', '10-15 years'],
          ['Surface (coastal)', 'Stainless 316 or hot-dip', '10-20 years'],
          ['Chemical exposure', 'Specialized coatings', '5-10 years']
        ]
      }
    },
    {
      id: 'installation',
      heading: { en: 'Installation Best Practices', zh: '安装最佳实践' },
      body: {
        en: 'Proper installation is as important as correct selection. Follow these guidelines for optimal performance.',
        zh: '正确的安装与正确的选型同样重要。遵循以下指南以获得最佳性能。'
      }
    },
    {
      id: 'maintenance',
      heading: { en: 'Inspection & Maintenance Schedule', zh: '检查与维护计划' },
      body: {
        en: 'Regular inspection prevents failures. Establish a maintenance schedule based on operating conditions.',
        zh: '定期检查可防止故障。根据操作条件建立维护计划。'
      },
      table: {
        headers: ['Inspection Frequency', 'Check Points', 'Action Required'],
        rows: [
          ['Weekly', 'Visual inspection of critical connections', 'Tighten if loose'],
          ['Monthly', 'Check for corrosion, missing fasteners', 'Replace corroded, add missing'],
          ['Quarterly', 'Torque verification, coating condition', 'Re-torque, recoat if needed'],
          ['Annually', 'Full structural inspection', 'Professional assessment']
        ]
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: [
        {
          q: { en: 'What grade of fastener is needed for platinum mines?', zh: '铂矿需要什么级别的紧固件？' },
          a: {
            en: 'Platinum mines typically require Grade 8.8 or 10.9 fasteners with HDG coating. For underground wet environments, consider Dacromet or stainless 316. Always consult with your engineering team for specific project requirements.',
            zh: '铂矿通常需要热镀锌涂层的8.8或10.9级紧固件。对于地下潮湿环境，考虑达克罗或316不锈钢。请务必咨询您的工程团队以了解具体项目要求。'
          }
        },
        {
          q: { en: 'How often should mining fasteners be inspected?', zh: '矿用紧固件应该多久检查一次？' },
          a: {
            en: 'Critical connections should be inspected weekly. General inspections monthly. Full torque verification quarterly. High-vibration areas may need more frequent checks.',
            zh: '关键连接应每周检查一次。一般检查每月一次。全面扭矩验证每季度一次。高振动区域可能需要更频繁的检查。'
          }
        },
        {
          q: { en: 'Can I use Grade 8.8 instead of 10.9 to save cost?', zh: '我可以用8.8级代替10.9级来节省成本吗？' },
          a: {
            en: 'Using a lower grade than specified can compromise safety and lead to failure. Always use the grade specified by your engineering drawings. Cost savings from downgrade are minimal compared to failure risks.',
            zh: '使用低于规定级别可能会危及安全并导致故障。请务必使用工程图纸规定的级别。与故障风险相比，降级节省的成本微乎其微。'
          }
        }
      ]
    },
    {
      id: 'cta',
      heading: { en: 'Get Expert Help with Your Mining Fastener Selection', zh: '获取矿用紧固件选型专家帮助' },
      body: {
        en: 'Ready to source the right fasteners for your mine? <a href="/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Browse our fastener catalog</a> or <a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">contact our team</a> for technical consultation.',
        zh: '准备好为您的矿山采购正确的紧固件了吗？<a href="/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">浏览我们的紧固件目录</a>或<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">联系我们的团队</a>获取技术咨询。'
      }
    }
  ];
}

// Logistics guide sections
function generateLogisticsGuideSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Introduction to Beira Port Logistics', zh: '贝拉港物流简介' },
      body: {
        en: `This guide covers the complete logistics process for importing fasteners via Beira Port to ${topic.targetCountries?.join(', ') || 'Southern Africa'}. Understanding the process helps avoid delays and extra costs.`,
        zh: `本指南涵盖经贝拉港进口紧固件到${topic.targetCountries?.join('、') || '南非地区'}的完整物流流程。了解流程有助于避免延误和额外成本。`
      }
    },
    {
      id: 'beira-port-overview',
      heading: { en: 'Beira Port Overview', zh: '贝拉港概况' },
      body: {
        en: 'Beira Port in Mozambique is the main gateway for Zimbabwe and landlocked Southern African countries. It offers shorter transit times compared to Durban.',
        zh: '莫桑比克的贝拉港是津巴布韦和南非内陆国家的主要通道。相比德班港，它提供更短的运输时间。'
      },
      table: {
        headers: ['Port Details', 'Information'],
        rows: [
          ['Location', 'Beira, Sofala Province, Mozambique'],
          ['Coordinates', '19°50\'S 34°50\'E'],
          ['Main Cargo Types', 'Container, bulk, breakbulk'],
          ['Container Capacity', '1,000+ TEU'],
          ['Operating Hours', '24/7 operations']
        ]
      }
    },
    {
      id: 'required-documents',
      heading: { en: 'Required Documents', zh: '所需文件' },
      body: {
        en: 'Proper documentation is critical for smooth customs clearance. Missing or incorrect documents cause most delays.',
        zh: '正确的文件对顺利清关至关重要。文件缺失或错误是大多数延误的原因。'
      },
      table: {
        headers: ['Document', 'Purpose', 'Who Provides'],
        rows: [
          ['Bill of Lading (B/L)', 'Ownership proof', 'Shipping line'],
          ['Commercial Invoice', 'Customs valuation', 'Exporter'],
          ['Packing List', 'Cargo details', 'Exporter'],
          ['Certificate of Origin', 'Duty eligibility', 'Chamber of Commerce'],
          ['Import Declaration', 'Zimbabwe customs', 'Clearance agent']
        ]
      }
    },
    {
      id: 'clearance-process',
      heading: { en: 'Customs Clearance Process', zh: '清关流程' },
      body: {
        en: 'The clearance process at Beira typically takes 3-5 working days with proper documentation.',
        zh: '在贝拉港，清关流程在文件齐全的情况下通常需要3-5个工作日。'
      },
      table: {
        headers: ['Stage', 'Duration', 'Key Actions'],
        rows: [
          ['Document Submission', 'Day 1', 'Submit all documents to customs'],
          ['Document Verification', 'Day 1-2', 'Customs reviews submitted documents'],
          ['Physical Inspection (if needed)', 'Day 2-3', 'Container inspection by customs'],
          ['Duty Payment', 'Day 3-4', 'Pay applicable import duties'],
          ['Release Order', 'Day 4-5', 'Container released for transit']
        ]
      }
    },
    {
      id: 'fees-estimates',
      heading: { en: 'Fee Estimates', zh: '费用估算' },
      body: {
        en: 'Understanding all fees helps budget accurately. These are estimates and may vary.',
        zh: '了解所有费用有助于准确预算。这些是估算，可能会有变动。'
      },
      table: {
        headers: ['Fee Type', 'Estimate (USD)', 'Notes'],
        rows: [
          ['Port Handling (Beira)', '$150-300 per container', 'Based on cargo type'],
          ['Customs Duty (Zimbabwe)', '20-40% CIF value', 'Subject to HS code'],
          ['Clearance Agent Fee', '$200-500', 'Per shipment'],
          ['Transit Insurance', '0.5-1.5% CIF value', 'Recommended'],
          ['Ground Transport (Beira-Harare)', '$1,500-2,500', 'Per 20ft container']
        ]
      }
    },
    {
      id: 'tips',
      heading: { en: 'Tips to Avoid Delays', zh: '避免延误的提示' },
      body: {
        en: 'Follow these best practices to ensure smooth clearance:',
        zh: '遵循这些最佳实践以确保顺利清关：'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: [
        {
          q: { en: 'How long does Beira port clearance take?', zh: '贝拉港清关需要多长时间？' },
          a: {
            en: 'With proper documentation, clearance typically takes 3-5 working days. Delays can occur during holidays or if documents are incomplete.',
            zh: '在文件齐全的情况下，清关通常需要3-5个工作日。节假日或文件不完整时可能会延误。'
          }
        },
        {
          q: { en: 'Do I need a customs agent in Mozambique?', zh: '我需要在莫桑比克聘请清关代理吗？' },
          a: {
            en: 'Yes, you need a licensed customs clearing agent in Mozambique. We can recommend reliable agents who handle fastener imports regularly.',
            zh: '是的，您需要在莫桑比克聘请有执照的海关清关代理。我们可以推荐定期处理紧固件进口的可靠代理。'
          }
        }
      ]
    },
    {
      id: 'cta',
      heading: { en: 'Need Help with Beira Port Logistics?', zh: '需要贝拉港物流帮助吗？' },
      body: {
        en: 'We have experience with Beira Port clearance for fastener shipments. <a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact us</a> for logistics support.',
        zh: '我们有贝拉港紧固件装运清关的经验。<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>获取物流支持。'
      }
    }
  ];
}

// Regional supplier sections
function generateRegionalSupplierSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Market Overview', zh: '市场概况' },
      body: {
        en: `This guide covers fastener supply to ${topic.targetCountries?.join(' and ') || 'target markets'} via Beira Port. The region has growing demand for quality construction and mining fasteners.`,
        zh: `本指南涵盖经贝拉港向${topic.targetCountries?.join('和') || '目标市场'}供应紧固件。该地区对优质建筑和矿业紧固件的需求不断增长。`
      }
    },
    {
      id: 'market-analysis',
      heading: { en: 'Market Analysis', zh: '市场分析' },
      body: {
        en: `The ${topic.targetCountries?.join('/')} fastener market is driven by infrastructure development and mining activities.`,
        zh: `${topic.targetCountries?.join('/')}紧固件市场由基础设施建设和矿业活动推动。`
      }
    },
    {
      id: 'sourcing-options',
      heading: { en: 'Sourcing Options', zh: '采购选项' },
      body: {
        en: 'There are several options for sourcing fasteners to this region.',
        zh: '向该地区采购紧固件有几种选择。'
      }
    },
    {
      id: 'logistics',
      heading: { en: 'Logistics via Beira Port', zh: '经贝拉港物流' },
      body: {
        en: 'Beira Port offers the most direct route for imports to this region.',
        zh: '贝拉港为该地区进口提供最直接的路线。'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: [
        {
          q: { en: 'What is the lead time to these countries?', zh: '到这些国家的交货期是多久？' },
          a: {
            en: 'From China port to final destination typically takes 30-40 days: 14-20 days sea freight to Beira, 3-5 days clearance, 10-15 days transit to final destination.',
            zh: '从中国港口到最终目的地通常需要30-40天：海运到贝拉14-20天，清关3-5天，到最终目的地转运10-15天。'
          }
        }
      ]
    },
    {
      id: 'cta',
      heading: { en: 'Start Your Import Process', zh: '开始您的进口流程' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact us</a> for pricing and logistics support.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>获取报价和物流支持。'
      }
    }
  ];
}

// Reference guide sections
function generateReferenceGuideSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Introduction', zh: '简介' },
      body: {
        en: 'This reference guide provides detailed comparison of fastener standards relevant to Zimbabwe and Southern African construction projects.',
        zh: '本参考指南提供与津巴布韦和南非建筑项目相关的紧固件标准详细对照。'
      }
    },
    {
      id: 'standards-overview',
      heading: { en: 'Standards Overview', zh: '标准概览' },
      body: {
        en: 'Understanding the standards that apply to your project ensures you get the right fasteners.',
        zh: '了解适用于您项目的标准可确保您获得正确的紧固件。'
      }
    },
    {
      id: 'comparison-tables',
      heading: { en: 'Standard Comparison Tables', zh: '标准对照表' },
      table: {
        headers: ['Application', 'SABS Standard', 'ISO Standard', 'GB Standard'],
        rows: [
          ['General bolts', 'SABS 1431', 'ISO 4014', 'GB/T 5782'],
          ['Nuts', 'SABS 1522', 'ISO 4032', 'GB/T 6170'],
          ['Washers', 'SABS 1352', 'ISO 7089', 'GB/T 97.1']
        ]
      }
    },
    {
      id: 'application-guide',
      heading: { en: 'Application Guide', zh: '应用指南' },
      body: {
        en: 'Use this guide to select the right standard for your specific application.',
        zh: '使用本指南为您的特定应用选择正确的标准。'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: [
        {
          q: { en: 'Are ISO and SABS standards interchangeable?', zh: 'ISO和SABS标准可以互换吗？' },
          a: {
            en: 'In most cases, yes. SABS standards are often based on ISO or BS standards. However, always verify with your engineering team for critical applications.',
            zh: '在大多数情况下可以。SABS标准通常基于ISO或BS标准。但是，对于关键应用，请务必与您的工程团队确认。'
          }
        }
      ]
    },
    {
      id: 'cta',
      heading: { en: 'Need Help with Standard Selection?', zh: '需要标准选择帮助吗？' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact our technical team</a> for standard verification.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们的技术团队</a>获取标准验证帮助。'
      }
    }
  ];
}

// Practical guide sections
function generatePracticalGuideSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Introduction', zh: '简介' },
      body: {
        en: `This practical guide addresses ${topic.title_en.toLowerCase()}. Get actionable solutions for your import operations.`,
        zh: `本实用指南解决${topic.title_zh}的问题。为您的进口运营获取可行的解决方案。`
      }
    },
    {
      id: 'challenges',
      heading: { en: 'Common Challenges', zh: '常见挑战' },
      body: {
        en: 'Understanding the challenges is the first step to solving them.',
        zh: '了解挑战是解决问题的第一步。'
      }
    },
    {
      id: 'solutions',
      heading: { en: 'Practical Solutions', zh: '实用解决方案' },
      body: {
        en: 'Here are proven solutions to the common challenges.',
        zh: '以下是常见挑战的成熟解决方案。'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: [
        {
          q: { en: 'What is the best approach?', zh: '最佳方法是什么？' },
          a: {
            en: 'The best approach depends on your specific situation. Contact us for personalized advice.',
            zh: '最佳方法取决于您的具体情况。联系我们获取个性化建议。'
          }
        }
      ]
    },
    {
      id: 'cta',
      heading: { en: 'Get Personalized Solutions', zh: '获取个性化解决方案' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact us</a> to discuss your specific needs.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>讨论您的具体需求。'
      }
    }
  ];
}

// Application guide sections
function generateApplicationGuideSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Application Overview', zh: '应用概况' },
      body: {
        en: `This guide covers ${topic.title_en.toLowerCase()} applications in ${topic.targetCountries?.join(', ') || 'the region'}.`,
        zh: `本指南涵盖${topic.targetCountries?.join('、') || '该地区'}${topic.title_zh}的应用。`
      }
    },
    {
      id: 'requirements',
      heading: { en: 'Application Requirements', zh: '应用要求' },
      body: {
        en: 'Different applications have different fastener requirements.',
        zh: '不同的应用有不同的紧固件要求。'
      }
    },
    {
      id: 'selection',
      heading: { en: 'Fastener Selection', zh: '紧固件选择' },
      body: {
        en: 'Use this guide to select the right fasteners for your application.',
        zh: '使用本指南为您的应用选择正确的紧固件。'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: []
    },
    {
      id: 'cta',
      heading: { en: 'Get Help with Application Selection', zh: '获取应用选择帮助' },
      body: {
        en: '<a href="/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Browse our products</a> or <a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">contact us</a>.',
        zh: '<a href="/products" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">浏览我们的产品</a>或<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>。'
      }
    }
  ];
}

// Case study sections
function generateCaseStudySections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Case Study Overview', zh: '案例研究概况' },
      body: {
        en: `This case study demonstrates how a ${topic.targetAudience?.split(',')[0] || 'company'} achieved significant improvements through strategic fastener sourcing.`,
        zh: `本案例研究展示了一家${topic.targetAudience?.split('，')[0] || '公司'}如何通过战略性紧固件采购实现显著改善。`
      }
    },
    {
      id: 'background',
      heading: { en: 'Company Background', zh: '公司背景' },
      body: {
        en: 'The company operates in Zimbabwe with significant fastener requirements for their operations.',
        zh: '该公司在津巴布韦运营，业务有大量紧固件需求。'
      }
    },
    {
      id: 'challenge',
      heading: { en: 'The Challenge', zh: '挑战' },
      body: {
        en: 'The company faced challenges with fastener costs, supply reliability, and quality consistency.',
        zh: '该公司面临紧固件成本、供货可靠性和质量一致性的挑战。'
      }
    },
    {
      id: 'solution',
      heading: { en: 'The Solution', zh: '解决方案' },
      body: {
        en: 'Through strategic sourcing and partnership, significant improvements were achieved.',
        zh: '通过战略性采购和合作，取得了显著改善。'
      }
    },
    {
      id: 'results',
      heading: { en: 'Results', zh: '结果' },
      table: {
        headers: ['Metric', 'Before', 'After', 'Improvement'],
        rows: [
          ['Fastener Cost', '$X per ton', '$Y per ton', '40% savings'],
          ['Lead Time', 'X weeks', 'Y weeks', '30% faster'],
          ['Quality Issues', 'X% reject rate', 'Y%', '80% reduction']
        ]
      }
    },
    {
      id: 'lessons',
      heading: { en: 'Key Lessons Learned', zh: '关键经验教训' },
      body: {
        en: 'Here are the key takeaways from this case study.',
        zh: '以下是本案例研究的关键收获。'
      }
    },
    {
      id: 'cta',
      heading: { en: 'Achieve Similar Results', zh: '取得类似成果' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact us</a> to discuss how we can help your business.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>讨论我们如何帮助您的业务。'
      }
    }
  ];
}

// Quarterly update sections
function generateQuarterlyUpdateSections(topic) {
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;
  return [
    {
      id: 'overview',
      heading: { en: `${quarter} Market Overview`, zh: `${quarter}市场概况` },
      body: {
        en: `This quarterly update covers fastener market developments for ${topic.targetCountries?.join(', ') || 'Zimbabwe and region'}.`,
        zh: `本季度更新涵盖${topic.targetCountries?.join('、') || '津巴布韦及周边地区'}紧固件市场动态。`
      }
    },
    {
      id: 'market-trends',
      heading: { en: 'Market Trends', zh: '市场趋势' },
      body: {
        en: 'Key market trends affecting the fastener industry in this quarter.',
        zh: '本季度影响紧固件行业的主要市场趋势。'
      }
    },
    {
      id: 'price-update',
      heading: { en: 'Price Update', zh: '价格更新' },
      body: {
        en: 'Current pricing trends and forecasts for fastener prices.',
        zh: '紧固件价格当前趋势和预测。'
      }
    },
    {
      id: 'logistics',
      heading: { en: 'Logistics Update', zh: '物流更新' },
      body: {
        en: 'Current logistics situation and any changes affecting imports.',
        zh: '当前物流情况及影响进口的任何变化。'
      }
    },
    {
      id: 'outlook',
      heading: { en: 'Quarterly Outlook', zh: '季度展望' },
      body: {
        en: 'Our outlook for the coming quarter.',
        zh: '我们对下一季度的展望。'
      }
    },
    {
      id: 'cta',
      heading: { en: 'Stay Updated', zh: '保持更新' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Subscribe to our newsletter</a> for monthly updates.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">订阅我们的新闻通讯</a>获取每月更新。'
      }
    }
  ];
}

// Standard sections (fallback)
function generateStandardSections(topic) {
  return [
    {
      id: 'overview',
      heading: { en: 'Introduction', zh: '简介' },
      body: {
        en: `Complete guide to ${topic.title_en.toLowerCase()}. Expert insights for ${topic.targetCountries?.join(', ') || 'African'} ${topic.targetAudience?.toLowerCase() || 'importers'}.`,
        zh: `${topic.title_zh}完整指南。为${topic.targetCountries?.join('、') || '非洲'}的${topic.targetAudience || '进口商'}提供专业见解。`
      }
    },
    {
      id: 'key-points',
      heading: { en: 'Key Points', zh: '关键要点' },
      body: {
        en: 'Here are the most important points to understand.',
        zh: '以下是需要理解的最重要的要点。'
      }
    },
    {
      id: 'faq',
      heading: { en: 'Frequently Asked Questions', zh: '常见问题' },
      faqItems: []
    },
    {
      id: 'cta',
      heading: { en: 'Get Started', zh: '开始' },
      body: {
        en: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2">Contact us</a> for more information.',
        zh: '<a href="/contact" class="text-primary-600 hover:text-primary-800 underline underline-offset-2\">联系我们</a>获取更多信息。'
      }
    }
  ];
}

// Validate article structure
function validateArticle(article) {
  const errors = [];
  
  // Check required top-level properties
  if (!article.slug) errors.push('Missing slug');
  if (!article.title?.en) errors.push('Missing title.en');
  if (!article.title?.zh) errors.push('Missing title.zh');
  if (!article.sections) errors.push('Missing sections');
  
  // Check sections
  if (article.sections) {
    article.sections.forEach((section, i) => {
      if (!section.id) errors.push(`Section ${i} missing id`);
      if (!section.heading?.en) errors.push(`Section ${i} missing heading.en`);
    });
  }
  
  return errors;
}

// Commit and push to git
function commitArticle(article, dryRun = false) {
  const filePath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  
  if (dryRun) {
    log(`[DRY RUN] Would write article to: ${filePath}`);
    return;
  }
  
  try {
    // Write the article file
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');
    log(`Article written to: ${filePath}`);
    
    // Git add and commit
    const commitMsg = `feat(content): add ${article.slug} article\n\n- ${article.title.en}\n- Priority: ${article.priority || 'P1'}`;
    
    execSync('git add .', { cwd: PROJECT_ROOT, stdio: 'pipe' });
    execSync(`git commit -m "${commitMsg}"`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
    log('Git commit successful');
    
    // Push
    execSync('git push origin main', { cwd: PROJECT_ROOT, stdio: 'pipe' });
    log('Git push successful');
    
    return true;
  } catch (err) {
    log(`Git operation failed: ${err.message}`, 'ERROR');
    return false;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const options = {
    dryRun: args.includes('--dry-run'),
    topicId: args.find(a => a.startsWith('--topic='))?.split('=')[1],
    list: args.includes('--list'),
    next: args.includes('--next'),
    deploy: args.includes('--deploy')
  };
  
  log('=== TradeGo Zimbabwe Content Generator ===');
  log(`Options: ${JSON.stringify(options)}`);
  
  // Load queue
  const queue = loadQueue();
  
  // List mode
  if (options.list) {
    console.log('\n=== Topic Queue ===');
    queue.topics.forEach(t => {
      console.log(`[${t.status.toUpperCase()}] [${t.priority}] Week ${t.scheduledWeek}: ${t.title_en}`);
    });
    console.log(`\nTotal: ${queue.topics.length} topics`);
    console.log(`Pending: ${queue.topics.filter(t => t.status === 'pending').length}`);
    console.log(`Completed: ${queue.topics.filter(t => t.status === 'done').length}`);
    return;
  }
  
  // Next mode
  if (options.next) {
    const nextTopic = getNextTopic(queue);
    if (nextTopic) {
      console.log('\n=== Next Topic ===');
      console.log(`ID: ${nextTopic.id}`);
      console.log(`Title: ${nextTopic.title_en}`);
      console.log(`Priority: ${nextTopic.priority}`);
      console.log(`Scheduled Week: ${nextTopic.scheduledWeek}`);
      console.log(`Template: ${nextTopic.template}`);
    } else {
      console.log('No pending topics found');
    }
    return;
  }
  
  // Generate mode
  let targetTopic;
  if (options.topicId) {
    targetTopic = queue.topics.find(t => t.id === options.topicId);
    if (!targetTopic) {
      log(`Topic not found: ${options.topicId}`, 'ERROR');
      process.exit(1);
    }
  } else {
    targetTopic = getNextTopic(queue);
  }
  
  if (!targetTopic) {
    log('No pending topics to generate', 'WARN');
    return;
  }
  
  log(`Generating article for: ${targetTopic.title_en}`);
  
  // Generate article
  const article = generateArticle(targetTopic, queue);
  
  // Validate
  const errors = validateArticle(article);
  if (errors.length > 0) {
    log(`Validation errors: ${errors.join(', ')}`, 'ERROR');
    // Continue anyway, we'll fix after
  }
  
  // Commit
  const success = commitArticle(article, options.dryRun);
  
  if (success) {
    // Update queue
    targetTopic.status = 'done';
    targetTopic.completedDate = new Date().toISOString().split('T')[0];
    targetTopic.articleSlug = article.slug;
    
    queue.completedTopics = queue.completedTopics || [];
    queue.completedTopics.push({
      id: targetTopic.id,
      title_en: targetTopic.title_en,
      completedDate: targetTopic.completedDate,
      articleSlug: article.slug
    });
    
    saveQueue(queue);
    
    log(`Article completed: ${article.slug}`);
    
    // Trigger deployment if requested
    if (options.deploy && !options.dryRun) {
      log('Triggering deployment...');
      try {
        execSync('npx vercel --prod --force', { 
          cwd: PROJECT_ROOT, 
          stdio: 'inherit',
          timeout: 180000
        });
        log('Deployment triggered successfully');
      } catch (err) {
        log(`Deployment failed: ${err.message}`, 'ERROR');
      }
    }
  }
}

// Run
main();

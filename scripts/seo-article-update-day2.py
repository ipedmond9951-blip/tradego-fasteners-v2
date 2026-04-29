#!/usr/bin/env python3
"""Update 5 more articles with metaDescription, FAQ items, and unique images. Day 2."""
import json
import os

ARTICLES_DIR = "content/articles"

articles = {
    "algeria-fastener-market-complete-guide": {
        "metaDescription": "Complete guide to Algeria fastener market 2026: construction demand, import procedures, top supplier countries. Market analysis for buyers and distributors in North Africa.",
        "image": "/images/articles/algeria-fastener-market-complete-guide.jpg",
        "faqItems": [
            {
                "question": "What is the current size of Algeria's fastener market?",
                "answer": "Algeria's fastener market is valued at approximately $180-220 million annually, driven by extensive construction activity in Algiers, Oran, and Constantine. The government's housing program (LPP, LDP) creates steady demand for construction fasteners including anchor bolts, hex bolts, and washers."
            },
            {
                "question": "What types of fasteners are most needed in Algeria?",
                "answer": "Construction fasteners dominate demand: hex bolts (Grade 8.8) for structural steel; anchor bolts (M12-M24) for concrete foundations; washers and nuts for assembly. SABS and European standards are preferred over Chinese standards for government projects, while private construction accepts DIN/ISO compliant fasteners."
            },
            {
                "question": "How to import fasteners from China to Algeria?",
                "answer": "Import process: 1) Obtain import license from Ministry of Commerce; 2) Register with CNRC (National Register of Commerce); 3) Arrange customs clearance via licensed broker; 4) Pay duties (30% for steel products) and VAT (19%). Sea freight via Port of Algiers or Oran is most common, taking 25-35 days from Chinese ports."
            },
            {
                "question": "Who are the major fastener suppliers serving Algeria?",
                "answer": "Major suppliers include European manufacturers (Bossard, Wurth) for premium projects, Turkish suppliers for mid-market, and Chinese manufacturers (Ningbo, Shanghai exporters) for cost-competitive products. Chinese suppliers dominate the volume segment with 60%+ market share due to price advantages of 30-40% versus European alternatives."
            },
            {
                "question": "What are the main challenges of fastener trade with Algeria?",
                "answer": "Key challenges: Complex import licensing requirements; Payment terms (letters of credit difficult to arrange); Currency restrictions (Algerian dinar not freely convertible); Port congestion at Algiers; Competition from Turkish and European suppliers with established relationships. Building local partnerships is essential for long-term success."
            }
        ]
    },
    "anchor-bolts-foundation-guide": {
        "metaDescription": "Complete guide to anchor bolts for foundation and structural connections. Types, installation methods, load ratings, and concrete anchor bolt specifications for construction.",
        "image": "/images/articles/anchor-bolts-foundation-guide.jpg",
        "faqItems": [
            {
                "question": "What are anchor bolts used for in foundations?",
                "answer": "Anchor bolts secure structural steel columns, equipment, and machinery to concrete foundations. They transfer tensile and shear loads from the structure to the concrete foundation. Critical for: building columns, pre-engineered metal buildings, solar panel mounts, transmission towers, and heavy equipment bases."
            },
            {
                "question": "How deep should anchor bolts be embedded in concrete?",
                "answer": "Embedment depth follows formula: 4-6 × bolt diameter for medium loads. For structural columns: minimum 8 inches (200mm) for M16, 10 inches (250mm) for M20, 12 inches (300mm) for M24. South African code SANS 10400 specifies minimum 12d where d is bolt diameter. Always verify with structural engineer for specific applications."
            },
            {
                "question": "What types of anchor bolts are best for seismic zones?",
                "answer": "Seismic zones require: 1) ASTM F1554 Grade 55 or 105 (higher yield strength); 2) Plate anchors with large base plates for improved load distribution; 3) Headed anchor bolts (better than J-bolts under cyclic loading); 4) Supplementary reinforcement (hooks or plates) to prevent concrete cone failure. Always specify seismic design category per local building codes."
            },
            {
                "question": "How do I select the right anchor bolt size for my project?",
                "answer": "Selection criteria: 1) Calculate design tensile and shear loads; 2) Check concrete compressive strength (typically 25-30 MPa); 3) Determine embedment depth required for load capacity; 4) Apply safety factor (4:1 minimum for static loads); 5) Consider edge distance and spacing (minimum 10 × bolt diameter between bolts). Use manufacturer load tables or consult structural engineer."
            },
            {
                "question": "What is the difference between J-bolts and L-bolts?",
                "answer": "J-bolts have a J-shaped bend at the embedded end - shaped like the letter J. L-bolts have a 90-degree bend - shaped like the letter L. Both provide anchorage through mechanical interlock with concrete. J-bolts are more common for equipment mounting; L-bolts are preferred for structural columns where the bend hooks around rebar. Both must be positioned before concrete pour (cast-in-place)."
            }
        ]
    },
    "anchor-bolts-suppliers-africa": {
        "metaDescription": "Find reliable anchor bolt suppliers for Africa projects. China manufacturers, import guide, quality verification, and sourcing strategies for construction anchor bolts across Africa.",
        "image": "/images/articles/anchor-bolts-suppliers-africa.jpg",
        "faqItems": [
            {
                "question": "Where can I find reliable anchor bolt suppliers in Africa?",
                "answer": "Reliable sources: 1) Chinese manufacturers (Ningbo, Hebei, Jiangsu provinces) - 70% of Africa's imported anchor bolts; 2) South African manufacturers (Bolt and Engineering - Cape Town, Pro Fasteners - Johannesburg) for local supply; 3) Turkish exporters for European-quality alternatives. TradeGo connects buyers with verified manufacturers meeting SABS, DIN, and ASTM standards."
            },
            {
                "question": "Why source anchor bolts from China for African projects?",
                "answer": "China offers: 40-50% cost advantage versus European suppliers; Full range of anchor bolt types (J-bolts, L-bolts, plate anchors, wedge anchors); Custom manufacturing for special configurations; Production capacity of 500+ tons/month per factory; Flexible MOQ (1-5 tons for samples, 20+ tons for standard orders). Major ports: Shanghai, Ningbo, Tianjin."
            },
            {
                "question": "What are the import duties for fasteners to African countries?",
                "answer": "Import duties vary by country: South Africa: 20% for steel fasteners (SARS schedule); Kenya: 25% plus 16% VAT (KEBS requirements); Nigeria: 35% plus 7.5% levy (SON certified required); Tanzania: 10% plus 18% VAT; Zimbabwe: 40% for steel products (ZIMRA). Always verify current rates with freight forwarder as rates change."
            },
            {
                "question": "How to verify anchor bolt quality from Chinese manufacturers?",
                "answer": "Verification steps: 1) Request material test certificates (MTC) per EN 10204 3.1; 2) Verify chemical composition and mechanical properties; 3) Third-party inspection (SGS, Bureau Veritas, CCIC) - $200-400 per visit; 4) Request sample orders before bulk production; 5) Check factory audit reports on platforms like Alibaba Gold Suppliers. Request tensile testing, bend testing, and hardness testing reports."
            },
            {
                "question": "What are the lead times for anchor bolts shipped to Africa?",
                "answer": "Lead times: Manufacturing: 15-25 days for standard items; Quality inspection: 3-5 days; Sea freight to East Africa (Mombasa): 25-30 days; Sea freight to West Africa (Lagos/Douala): 30-40 days; Sea freight to South Africa (Durban): 35-45 days. Air freight available for urgent orders but 5-7x cost. Total: 45-75 days from order to delivery at port."
            }
        ]
    },
    "automotive-commercial-vehicle-fasteners": {
        "metaDescription": "Critical fasteners for automotive and commercial vehicles: wheel nuts, hub bolts, chassis fasteners. Specifications, torque requirements, and quality standards for fleet maintenance.",
        "image": "/images/articles/automotive-commercial-vehicle-fasteners.jpg",
        "faqItems": [
            {
                "question": "What fasteners are used in commercial vehicle manufacturing?",
                "answer": "Commercial vehicles use specialized fasteners: Wheel nuts and hub bolts (Grade 10.9-12.9); Chassis bolts (Grade 10.9 with prevailing torque nuts); Engine mount bolts (Grade 12.9, often torque-to-yield); Suspension fasteners (Grade 10.9 with vibration-resistant locking). These require specific fatigue resistance, preload retention, and corrosion protection."
            },
            {
                "question": "How do wheel nuts differ from standard hex nuts?",
                "answer": "Wheel nuts are specifically designed for wheel attachment: 1) Tapered seat (60° or 90°) for secure wheel mounting; 2) Hardened steel (HRc 38-45) for durability; 3) Extended threads for multiple wheel disc thicknesses; 4) Often serrated or flanged for vibration resistance; 5) Specific hex sizes per vehicle manufacturer (17mm, 19mm, 21mm, 22mm, 24mm)."
            },
            {
                "question": "What is the torque specification for automotive hub bolts?",
                "answer": "Hub bolt torque specifications: Light trucks/SUVs: 90-120 Nm (66-88 ft-lb); Heavy trucks: 300-450 Nm (220-330 ft-lb); Buses: 350-500 Nm (260-370 ft-lb). Critical: Always use calibrated torque wrench, follow star pattern tightening sequence, and re-torque after 100km (wheel settling). Over-tightening causes bolt yield or wheel stud failure."
            },
            {
                "question": "Why are automotive fasteners subject to strict quality standards?",
                "answer": "Automotive fasteners face extreme conditions: Vibration (engine, road); Cyclic loading (wheel rotation); Corrosion (road salt, moisture); Temperature extremes (-40°C to +150°C). Failure consequences are severe (wheel detachment). Standards: ISO 898 (mechanical properties); IATF 16949 (quality management); SAE J1199 (dimensional specs). Every fastener must meet traceability requirements."
            },
            {
                "question": "How to maintain and inspect vehicle fasteners?",
                "answer": "Inspection schedule: Every 10,000 km: Check wheel nuts with torque wrench; Every 20,000 km: Inspect chassis fasteners; Every 50,000 km: Full underbody fastener audit. Look for: Loosening (mark position with paint pen); Corrosion (replace immediately); Stretching (measure length vs new bolt); Cracking (visual inspection). Never reuse locking fasteners (prevailing torque nuts, lock washers)."
            }
        ]
    },
    "bolt-markings-identify-grade": {
        "metaDescription": "How to read and identify bolt grade markings. Metric and imperial bolt grades, tensile strength, and proper selection guide for industrial and construction applications.",
        "image": "/images/articles/bolt-markings-identify-grade.jpg",
        "faqItems": [
            {
                "question": "How do I read bolt grade markings?",
                "answer": "Metric bolt grades: Number on head = 1/100 of tensile strength in MPa. Example: 8.8 = 800 MPa tensile, 640 MPa yield. Two numbers: First (8) = tensile/100; Second (8) = yield ratio × 10. Imperial bolts: Grade 5 = 120,000 PSI; Grade 8 = 150,000 PSI. Look for manufacturer logo + grade marking on bolt head."
            },
            {
                "question": "What do the numbers on bolt heads mean?",
                "answer": "Metric markings: 4.6, 8.8, 10.9, 12.9 are most common. First number ÷ 100 = tensile strength in MPa. Second number ÷ 10 = yield ratio (percentage of tensile before yielding). Imperial: Grade 2 (low), Grade 5 (medium), Grade 8 (high). Always match exact grade specified - mixing grades causes structural failure."
            },
            {
                "question": "How to identify metric vs imperial bolt grades?",
                "answer": "Metric bolts: Head shows class (8.8, 10.9, etc.) with manufacturer logo. Thread pitch is fine (1.0-1.5mm for M10). Imperial bolts: Head shows radial lines (Grade 5 = 3 lines at 120° intervals). Thread pitch is coarser (1.5-2.0mm for 3/8 inch). Measure with caliper: M10 = 10mm diameter; 3/8 inch = 9.525mm diameter."
            },
            {
                "question": "What is the tensile strength of Grade 8.8 bolts?",
                "answer": "Grade 8.8 metric bolt: Tensile strength = 800 MPa (116,000 PSI); Yield strength = 640 MPa (92,800 PSI); Proof load = 580 MPa. This is intermediate strength - suitable for most construction and machinery applications. For critical structural work, specify Grade 10.9 (1000 MPa tensile) or Grade 12.9 (1200 MPa tensile)."
            },
            {
                "question": "Why do bolt markings matter for structural applications?",
                "answer": "Bolt markings ensure correct strength for load requirements. Using wrong grade causes: Under-specification = structural failure, collapse risk; Over-specification = cost waste, fitting problems. Critical factors: 1) Tensile strength (load capacity); 2) Yield strength (permanent deformation point); 3) Proof load (maximum before plastic deformation). Always verify markings match specification on engineering drawings."
            }
        ]
    }
}

def update_article(slug, updates):
    filepath = os.path.join(ARTICLES_DIR, f"{slug}.json")
    if not os.path.exists(filepath):
        print(f"  [SKIP] File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Update metaDescription
    data['metaDescription'] = updates['metaDescription']
    
    # Update image
    data['image'] = updates['image']
    
    # Add FAQ items
    data['faqItems'] = updates['faqItems']
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"  [OK] Updated {slug}")
    print(f"       metaDescription: {len(updates['metaDescription'])} chars")
    print(f"       image: {updates['image']}")
    print(f"       faqItems: {len(updates['faqItems'])} questions")
    return True

def main():
    print("Updating 5 articles with SEO improvements (Day 2)...")
    print()
    
    updated = []
    for slug, updates in articles.items():
        print(f"Processing: {slug}")
        if update_article(slug, updates):
            updated.append(slug)
        print()
    
    print(f"Successfully updated {len(updated)} articles:")
    for slug in updated:
        print(f"  - {slug}")

if __name__ == "__main__":
    main()

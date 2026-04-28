#!/usr/bin/env python3
"""Update 5 articles with metaDescription, FAQ items, and unique images."""
import json
import os

ARTICLES_DIR = "content/articles"

articles = {
    "bolt-types-applications-guide": {
        "metaDescription": "Learn about hex bolts, carriage bolts, eye bolts, U-bolts and more. Complete technical guide for industrial and construction applications in Africa.",
        "image": "/images/articles/bolt-types-applications-guide.jpg",
        "faqItems": [
            {
                "question": "What are the main types of bolts used in construction?",
                "answer": "The main bolt types used in construction are: Hex bolts (most common, DIN 933/ISO 4017) for general applications; Carriage bolts (DIN 603) for wood and timber; Eye bolts (DIN 580) for lifting; U-bolts for pipe and tube clamping; Anchor bolts for concrete foundations. Each type has specific applications and load ratings."
            },
            {
                "question": "How do I choose the right bolt type for my application?",
                "answer": "Choose bolt type based on: 1) Material being fastened (wood requires carriage bolts, metal uses hex bolts); 2) Load requirements (structural uses Grade 8.8/10.9); 3) Environment (outdoor/African humidity requires HDG or stainless steel); 4) Access for installation (hex bolts need wrenches, eye bolts need loops for lifting)."
            },
            {
                "question": "What is the difference between hex bolts and carriage bolts?",
                "answer": "Hex bolts have a six-sided head for wrench engagement and can be used on both sides of a joint. Carriage bolts have a round head with a square neck that prevents rotation during installation - ideal for wood and timber where you want a smooth appearance on one side."
            },
            {
                "question": "What bolt grades are recommended for structural applications in Africa?",
                "answer": "For structural applications in Africa's demanding environments: Grade 8.8 (800 MPa tensile) for general structures; Grade 10.9 (1000 MPa tensile) for high-load structural connections; Hot-dip galvanized (HDG) or stainless steel 316 for corrosion resistance against African humidity and coastal conditions."
            },
            {
                "question": "How do I prevent bolt corrosion in African climates?",
                "answer": "Prevent corrosion in African climates by: 1) Using hot-dip galvanized (HDG) bolts for outdoor construction - 45-85μm zinc coating; 2) Using stainless steel 316 for mining and coastal areas with high humidity; 3) Using the correct material for the environment - avoid carbon steel without coating; 4) Regular inspection and maintenance schedule."
            }
        ]
    },
    "anchor-bolts-selection-guide": {
        "metaDescription": "Complete guide to anchor bolts for African construction: J-bolts, L-bolts, plate anchors, wedge anchors. Load ratings, installation methods, and concrete applications.",
        "image": "/images/articles/anchor-bolts-selection-guide.jpg",
        "faqItems": [
            {
                "question": "What are the different types of anchor bolts for concrete?",
                "answer": "Main anchor bolt types: J-bolts (L-shaped, for equipment mounting); L-bolts (straight with bent end); Plate anchors (welded base plate, for structural columns); Wedge anchors (expansion type, for cracked/uncracked concrete); Epoxy anchors (adhesive-bonded, for high loads). Each type suits different load requirements and concrete conditions."
            },
            {
                "question": "How do I determine the correct anchor bolt size for my project?",
                "answer": "Determine anchor bolt size by: 1) Calculate design load (tension and shear); 2) Check concrete strength (typically 20-30 MPa for African construction); 3) Use manufacturer load tables for specific bolt size and embedment depth; 4) Apply appropriate safety factor (typically 4:1 for static loads); 5) Consider edge distance and spacing requirements."
            },
            {
                "question": "What is the difference between wedge anchors and J-bolts?",
                "answer": "Wedge anchors are expansion anchors that grip the concrete when tightened - one-piece design, for permanent installations in solid concrete. J-bolts are cast-in-place or inserted into wet concrete - repositionable before concrete sets, better for structural connections where alignment is critical."
            },
            {
                "question": "How deep should anchor bolts be embedded in concrete?",
                "answer": "Embedment depth depends on bolt diameter and load: General rule is 4-6 bolt diameters for medium loads. For structural applications, follow local codes: South Africa uses SABS 10400; minimum typically 8 inches (200mm) for M16 and larger bolts. Insufficient embedment causes pull-out failure - always verify with load calculations."
            },
            {
                "question": "When should epoxy anchor bolts be used?",
                "answer": "Use epoxy anchors when: 1) High tensile load requirements exceed expansion anchor capacity; 2) Close to concrete edge where expansion anchors would crack concrete; 3) Retrofitting existing concrete structures; 4) Anchoring near vibrating equipment. Epoxy provides chemical bonding and works in both cracked and uncracked concrete when properly installed."
            }
        ]
    },
    "carriage-bolts-guide": {
        "metaDescription": "Complete guide to carriage bolts (coach bolts) covering DIN 603 standards, wood applications, timber construction, and outdoor use with hot-dip galvanizing.",
        "image": "/images/articles/carriage-bolts-guide.jpg",
        "faqItems": [
            {
                "question": "What is the difference between carriage bolts and hex bolts?",
                "answer": "Carriage bolts (DIN 603) have a round head with a square collar below the head that locks into wood - preventing rotation when nuts are tightened from the opposite side. Hex bolts have a six-sided head and require wrench access from the bolt side. Carriage bolts provide a smooth, finished appearance on one side."
            },
            {
                "question": "How do I install carriage bolts in wood?",
                "answer": "Installation steps: 1) Drill a pilot hole slightly larger than the bolt shank; 2) Insert bolt from the smooth-side (visible side); 3) The square collar prevents rotation; 4) Add washer and hex nut from opposite side; 5) Tighten with wrench. For hardwoods, pre-drilling is essential to prevent wood splitting."
            },
            {
                "question": "What are the applications for carriage bolts in African construction?",
                "answer": "Carriage bolts are ideal for: Timber frame construction - widely used in roof trusses and wooden structures across Africa; Agricultural structures - barns, storage facilities; Playground equipment - smooth head prevents injury; Furniture assembly - clean finished appearance; Bridge decking where one-sided access is common."
            },
            {
                "question": "What is the difference between zinc-plated and hot-dip galvanized carriage bolts?",
                "answer": "Zinc-plated carriage bolts have 5-15μm electroplated zinc coating - suitable for indoor and dry environments. Hot-dip galvanized (HDG) bolts have 45-85μm zinc coating applied by dipping in molten zinc - essential for outdoor African construction, mining areas, and humid coastal regions. HDG provides 5-10x more corrosion protection."
            },
            {
                "question": "How do I choose between different lengths of carriage bolts?",
                "answer": "Choose carriage bolt length by: 1) Material thickness being fastened - bolt should pass through with 2-3 threads extending beyond nut; 2) General rule: minimum 3 threads engagement in nut; 3) For timber, consider wood compression over time; 4) Longer is not always better - excess length reduces shear capacity. Standard lengths available: 20mm to 300mm for DIN 603."
            }
        ]
    },
    "washer-types-applications": {
        "metaDescription": "Complete guide to washer types: flat washers, spring washers, lock washers, flange washers. Selection guide for construction and industrial applications.",
        "image": "/images/articles/washer-types-applications.jpg",
        "faqItems": [
            {
                "question": "What are the different types of washers and their uses?",
                "answer": "Main washer types: Flat washers (DIN 125/ISO 7089) - distribute load over larger area; Spring washers (DIN 127) - maintain bolt preload under vibration; Lock washers (external/internal DIN 7927/7935) - prevent loosening; Flange washers (DIN 6926) - combine load distribution with locking. Each serves specific load distribution or anti-loosening purposes."
            },
            {
                "question": "How do spring washers prevent bolt loosening?",
                "answer": "Spring washers (split lock washers) work by: 1) The split creates spring tension that maintains preload; 2) When vibration tries to loosen the nut, the spring absorbs the movement; 3) The angled edges grip the nut and mounting surface. For African mining and heavy machinery applications, always use spring washers or consider nylon insert lock nuts (Nyloc) for critical connections."
            },
            {
                "question": "When should flat washers vs flange washers be used?",
                "answer": "Use flat washers when: Standard load distribution is needed; Soft materials (wood, aluminum) that compress easily; Surface is flat and even. Use flange washers when: Bearing capacity of the material is low; Bolt head or nut bears on soft material; Extra grip and load distribution needed; High-vibration environments where standard washers might shift."
            },
            {
                "question": "What washer materials are best for outdoor African environments?",
                "answer": "For outdoor African conditions: Hot-dip galvanized (HDG) steel washers for general outdoor construction - matches HDG bolts; Stainless steel 304 washers for mining areas and humid coastal regions; Stainless steel 316 for marine and chemical environments with high chloride exposure; Always match washer material to bolt material to prevent galvanic corrosion."
            },
            {
                "question": "How do I select the right washer size for my bolt?",
                "answer": "Washer selection rules: Inner diameter should match bolt nominal size (M10 washer fits M10 bolt); Outer diameter should be 2-3x bolt diameter for load distribution; Thickness should provide adequate stiffness without being too thick. For structural applications, use standard dimensional washers per DIN 125 (flat) or DIN 127 (spring) specifications."
            }
        ]
    },
    "bolt-tightening-torque-guide": {
        "metaDescription": "Proper bolt tightening methods, torque specifications, preload control, and installation best practices. Includes torque charts for Grade 8.8 and 10.9 bolts.",
        "image": "/images/articles/bolt-tightening-torque-guide.jpg",
        "faqItems": [
            {
                "question": "What is the correct torque specification for Grade 8.8 bolts?",
                "answer": "Grade 8.8 torque values (Nm) for lubricated bolts: M6=10Nm, M8=25Nm, M10=49Nm, M12=85Nm, M16=210Nm, M20=410Nm, M24=710Nm. For plain (unlubricated) bolts, increase by 25%. These values are approximate - always refer to specific torque charts for your application and consider friction coefficients."
            },
            {
                "question": "How do I calculate torque for a specific bolt application?",
                "answer": "Torque calculation formula: T = K × F × d where: T = torque (Nm); K = friction coefficient (typically 0.2 for lubricated, 0.3 for plain); F = desired preload (N) = σ × As (stress × stress area); d = nominal bolt diameter (m). For African mining equipment, always use manufacturer-specified torque values with certified torque charts."
            },
            {
                "question": "What happens if bolts are over-tightened or under-tightened?",
                "answer": "Over-tightening risks: Bolt yield or fracture; Thread stripping; Gasket crushing; Distortion of joint components; Catastrophic failure in service. Under-tightening risks: Joint separation under load; Bolt fatigue from dynamic loads; Vibration-induced loosening; Leakage in flanged joints; Pre-mature failure in critical applications."
            },
            {
                "question": "What is the difference between torque tensioning and torque-to-yield?",
                "answer": "Torque tensioning (standard method): Applies predetermined torque value regardless of actual preload - simple but affected by friction. Torque-to-yield (TTB): Tightens to specific bolt stretch (yield point), more accurate preload control - used for critical structural connections like桥梁 and mining equipment. TTB requires careful control and skilled technicians."
            },
            {
                "question": "How do I use a torque wrench correctly?",
                "answer": "Torque wrench usage: 1) Select correct torque value for bolt grade and size; 2) Set wrench to desired value; 3) Apply smooth, steady pull - avoid jerky movements; 4) Listen/feel for click or release; 5) Never use as a breaker bar; 6) Calibrate annually. For African field conditions, use dial-type or click-type wrenches - digital requires battery management."
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
    print("Updating articles with SEO improvements...")
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

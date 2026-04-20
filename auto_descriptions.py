import re
import uuid

templates = {
    'snack': {
        'fr': 'Snack indien traditionnel croustillant et savoureux.',
        'en': 'Crispy and savory traditional Indian snack.',
        'es': 'Snack indio tradicional, crujiente y sabroso.',
        'de': 'Knuspriger und herzhafter traditioneller indischer Snack.',
        'it': 'Snack indiano tradizionale croccante e saporito.',
        'ar': 'وجبة خفيفة هندية تقليدية مقرمشة ولذيذة.',
        'hi': 'कुरकुरा और स्वादिष्ट पारंपरिक भारतीय स्नैक।'
    },
    'curry': {
        'fr': 'Préparé dans une sauce curry traditionnelle et onctueuse.',
        'en': 'Prepared in a traditional creamy curry sauce.',
        'es': 'Preparado en una salsa curry tradicional y cremosa.',
        'de': 'Zubereitet in einer traditionellen cremigen Currysauce.',
        'it': 'Preparato in una salsa curry tradizionale e cremosa.',
        'ar': 'محضر في صوص كاري كريمي تقليدي.',
        'hi': 'एक पारंपरिक मलाईदार करी सॉस में तैयार किया गया।'
    },
    'korma': {
        'fr': 'Mijoté dans une sauce douce à la crème, noix de cajou et amandes.',
        'en': 'Simmered in a mild cream, cashew, and almond sauce.',
        'es': 'Cocido a fuego lento en una salsa suave de crema, anacardos y almendras.',
        'de': 'Geköchelt in einer milden Sahne-, Cashew- und Mandelsauce.',
        'it': 'Cotto a fuoco lento in una salsa delicata di panna, anacardi e mandorle.',
        'ar': 'مطبوخ في صلصة كريمة خفيفة مع الكاجو واللوز.',
        'hi': 'हल्की मलाई, काजू और बादाम की चटनी में उबाला हुआ।'
    },
    'vindaloo': {
        'fr': 'Spécialité relevée avec épices fortes et pommes de terre.',
        'en': 'Spicy specialty with strong spices and potatoes.',
        'es': 'Especialidad picante con especias fuertes y patatas.',
        'de': 'Pikante Spezialität mit kräftigen Gewürzen und Kartoffeln.',
        'it': 'Specialità piccante con spezie forti e patate.',
        'ar': 'تخصص حار مع توابل قوية وبطاطس.',
        'hi': 'तेज मसालों और आलू के साथ मसालेदार विशेषता।'
    },
    'madras': {
        'fr': 'Curry épicé du sud de l\'Inde, parfumé à la moutarde et feuilles de curry.',
        'en': 'Spicy South Indian curry flavored with mustard and curry leaves.',
        'es': 'Curry picante del sur de la India con mostaza y hojas de curry.',
        'de': 'Pikantes südindisches Curry mit Senf und Curryblättern.',
        'it': 'Curry piccante dell\'India del Sud con senape e foglie di curry.',
        'ar': 'كاري جنوب الهند الحار بنكهة الخردل وأوراق الكاري.',
        'hi': 'सरसों और करी पत्ते के स्वाद वाली मसालेदार दक्षिण भारतीय करी।'
    },
    'biryani': {
        'fr': 'Riz basmati parfumé mijoté avec des épices douces et safran.',
        'en': 'Fragrant basmati rice simmered with mild spices and saffron.',
        'es': 'Arroz basmati fragante cocido con especias suaves y azafrán.',
        'de': 'Duftender Basmatireis mit milden Gewürzen und Safran geköchelt.',
        'it': 'Riso basmati profumato cotto a fuoco lento con spezie delicate e zafferano.',
        'ar': 'أرز بسمتي عطري مطبوخ مع توابل خفيفة وزعفران.',
        'hi': 'हल्के मसालों और केसर के साथ उबला हुआ सुगंधित बासमती चावल।'
    },
    'tikka': {
        'fr': 'Grillé au tandoor puis mijoté dans une sauce onctueuse.',
        'en': 'Grilled in a tandoor then simmered in a creamy sauce.',
        'es': 'Asado al tandoor y cocido a fuego lento en una salsa cremosa.',
        'de': 'Im Tandoor gegrillt, dann in einer cremigen Soße geköchelt.',
        'it': 'Grigliato al tandoor e poi cotto a fuoco lento in una salsa cremosa.',
        'ar': 'مشوي في التندور ثم يطبخ في صلصة كريمية.',
        'hi': 'तंदूर में ग्रिल किया हुआ और एक मलाईदार चटनी में उबाला हुआ।'
    },
    'kothu': {
        'fr': 'Émincé de pain paratha sauté sur plaque avec épices et herbes.',
        'en': 'Minced paratha flatbread sautéed on a griddle with spices.',
        'es': 'Pan paratha picado salteado a la plancha con especias y hierbas.',
        'de': 'Gewürfeltes Paratha-Fladenbrot, auf der Grillplatte mit Gewürzen gebraten.',
        'it': 'Pane paratha tritato saltato sulla piastra con spezie ed erbe.',
        'ar': 'خبز الباراثا المفروم مقلي على الشواية مع التوابل.',
        'hi': 'मसालों और जड़ी बूटियों के साथ ग्रिडल पर उबला हुआ कटा हुआ पराठा।'
    },
    'dosa': {
        'fr': 'Crêpe fermentée du sud de l\'Inde, croustillante et légère.',
        'en': 'Crispy and light fermented crepe from Southern India.',
        'es': 'Crepe fermentada del sur de la India, crujiente y ligera.',
        'de': 'Knuspriger und leichter fermentierter Crêpe aus Südindien.',
        'it': 'Crepe fermentata del Sud dell\'India, croccante e leggera.',
        'ar': 'كريب مخمر من جنوب الهند، مقرمش وخفيف.',
        'hi': 'दक्षिण भारत से खस्ता और हल्का किण्वित क्रेप।'
    },
    'naan': {
        'fr': 'Pain indien traditionnel cuit au four tandoor.',
        'en': 'Traditional Indian flatbread baked in a tandoor oven.',
        'es': 'Pan indio tradicional horneado en un horno tandoor.',
        'de': 'Traditionelles indisches Fladenbrot, im Tandoor-Ofen gebacken.',
        'it': 'Pane indiano tradizionale cotto nel forno tandoor.',
        'ar': 'خبز هندي مسطح تقليدي يخبز في فرن تندور.',
        'hi': 'तंदूर ओवन में पकाया हुआ पारंपरिक भारतीय फ्लैटब्रेड।'
    },
    'rice': {
        'fr': 'Riz basmati de première qualité, parfumé et léger.',
        'en': 'Premium basmati rice, fragrant and light.',
        'es': 'Arroz basmati de primera calidad, fragante y ligero.',
        'de': 'Premium Basmatireis, duftend und leicht.',
        'it': 'Riso basmati di prima qualità, profumato e leggero.',
        'ar': 'أرز بسمتي ممتاز وعطري وخفيف.',
        'hi': 'प्रीमियम बासमती चावल, सुगंधित और हल्का।'
    },
    'dessert': {
        'fr': 'Douceur indienne traditionnelle pour terminer votre repas.',
        'en': 'Traditional Indian sweet to round off your meal.',
        'es': 'Dulce indio tradicional para terminar tu comida.',
        'de': 'Traditionelle indische Süßigkeit, um Ihre Mahlzeit abzurunden.',
        'it': 'Dolce indiano tradizionale per concludere il pasto.',
        'ar': 'حلوى هندية تقليدية لإنهاء وجبتك.',
        'hi': 'अपना भोजन पूरा करने के लिए पारंपरिक भारतीय मिठाई।'
    }
}

# Determine template based on section context or item name
def get_template_key(item_html, context):
    name = re.search(r'<div class="menu-item-name">(.*?)</div>', item_html)
    if name:
        name_text = name.group(1).lower()
        if 'samosa' in name_text or 'bajji' in name_text or 'pakora' in name_text or 'roll' in name_text or 'raita' in name_text or 'salade' in name_text or 'assortiment' in name_text or 'vegan' in name_text:
            return 'snack'
        elif 'curry' in context.lower():
            return 'curry'
        elif 'korma' in context.lower():
            return 'korma'
        elif 'vindaloo' in context.lower():
            return 'vindaloo'
        elif 'madras' in context.lower():
            return 'madras'
        elif 'biryani' in context.lower() or 'biryani' in name_text:
            return 'biryani'
        elif 'tikka' in context.lower() or 'tikka' in name_text:
            return 'tikka'
        elif 'kothu' in context.lower() or 'kothu' in name_text:
            return 'kothu'
        elif 'dosa' in name_text:
            return 'dosa'
        elif 'naan' in name_text or 'paratha' in name_text or 'chapathi' in name_text or 'puri' in name_text:
            return 'naan'
        elif 'riz' in name_text or 'rice' in name_text:
            return 'rice'
        elif 'halwa' in name_text or 'fruit' in name_text or 'ladoo' in name_text or 'kulfi' in name_text or 'pak' in name_text or 'falooda' in name_text or 'milkshake' in name_text:
            return 'dessert'
    
    # Fallback based on contextual words that we track while scanning HTML
    c = context.lower()
    if 'entree' in c or 'snack' in c or 'salade' in c: return 'snack'
    if 'curry' in c: return 'curry'
    if 'korma' in c: return 'korma'
    if 'vindaloo' in c: return 'vindaloo'
    if 'madras' in c: return 'madras'
    if 'biryani' in c: return 'biryani'
    if 'spécialité' in c or 'chef' in c: return 'tikka'
    if 'kothu' in c: return 'kothu'
    if 'dosa' in c: return 'dosa'
    if 'pain' in c: return 'naan'
    if 'dessert' in c or 'boisson' in c: return 'dessert'
    
    return 'curry' # absolute fallback

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

out_html = []
current_context = ""
idx = 0
added_keys = []

translations_to_add = {
    'fr': {}, 'en': {}, 'es': {}, 'de': {}, 'it': {}, 'ar': {}, 'hi': {}
}

import re
# We parse the file sequentially focusing on div segments to track context headings like menu-subsection-title
lines = html.splitlines()
new_lines = []

for line in lines:
    title_match = re.search(r'<div class="menu-subsection-title"[^>]*>(.*?)</div>', line)
    if title_match:
        current_context = title_match.group(1)
    
    # Check if a menu-item line
    if '<div class="menu-item">' in line:
        if '<div class="menu-item-desc">' not in line:
            # We need to inject!
            template_key = get_template_key(line, current_context)
            desc_fr = templates[template_key]['fr']
            
            # Generate a unique key
            unique_key = f"desc_auto_{template_key}_{len(added_keys)}"
            added_keys.append(unique_key)
            
            for lang in templates[template_key]:
                translations_to_add[lang][unique_key] = templates[template_key][lang]
            
            # Inject it after <div class="menu-item-name">...</div>
            # Since names might have span tags inside them:
            def inject_desc(m):
                original_name_section = m.group(0)
                desc_html = f'<div class="menu-item-desc" data-i18n="{unique_key}">{desc_fr}</div>'
                return original_name_section + desc_html

            line = re.sub(r'<div class="menu-item-name">.*?</div>', inject_desc, line)
            
    new_lines.append(line)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print(f"Injected {len(added_keys)} descriptions into HTML.")

# Update translations.js
with open('translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

for lang, val in translations_to_add.items():
    if not val: continue
    lines_to_add = '\n'.join([f'    "{k}": "{v}",' for k, v in val.items()])
    # We find the lang marker, e.g. fr: {
    js = re.sub(f'({lang}:\s*{{)', r'\1\n' + lines_to_add, js)

with open('translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Translations JS updated.")

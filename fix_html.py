import re
import json

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update prices in index.html to match menu
html = re.sub(r'(<h3 class="dish-name" data-i18n="dish1_name">.*?</h3>\s*<p class="dish-desc" data-i18n="dish1_desc">.*?</p>\s*<p class="dish-price">)\d+\.\d+€(</p>)', r'\g<1>13.90€\g<2>', html)
html = re.sub(r'(<h3 class="dish-name" data-i18n="dish2_name">.*?</h3>\s*<p class="dish-desc" data-i18n="dish2_desc">.*?</p>\s*<p class="dish-price">)\d+\.\d+€(</p>)', r'\g<1>4.50€\g<2>', html)
html = re.sub(r'(<h3 class="dish-name" data-i18n="dish3_name">.*?</h3>\s*<p class="dish-desc" data-i18n="dish3_desc">.*?</p>\s*<p class="dish-price">)\d+\.\d+€(</p>)', r'\g<1>14.90€\g<2>', html)
html = html.replace('gallary/unnamed (8).webp', 'gallary/Lotus Food and Beverage_Chicken 65_1242x704.webp')
html = re.sub(r'(<h3 class="dish-name" data-i18n="dish4_name">.*?</h3>\s*<p class="dish-desc" data-i18n="dish4_desc">.*?</p>\s*<p class="dish-price">)\d+\.\d+€(</p>)', r'\g<1>12.90€\g<2>', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('translations.js', 'r', encoding='utf-8') as f:
    trans = f.read()

new_dishes = {
    'fr': [
        ("Butter Chicken Signature", "Suprême de poulet mariné et grillé, préparé avec une sauce douce parfumée au beurre."),
        ("Samosa Légumes", "Samosas croustillants farcis aux légumes avec épices."),
        ("Thalli Non-Veg", "Plateau servi avec viande, fruit de mer, riz, raita."),
        ("Chicken 65 Maison", "Poulet mariné et frit, sauté avec poivron, oignon, ail, sauce pimentée.")
    ],
    'en': [
        ("Signature Butter Chicken", "Marinated and grilled chicken supreme, prepared with a sweet butter-flavored sauce."),
        ("Vegetable Samosas", "Crispy samosas stuffed with fresh vegetables and Indian spices."),
        ("Non-Veg Thali", "Platter served with assorted non-vegetarian dishes, meat, seafood, rice and raita."),
        ("House Chicken 65", "Marinated fried chicken sautéed with peppers, onions, garlic and spicy sauce.")
    ]
}

# The regex replaces values for the first 4 dishes in the translation dictionary
for lang, dishes in new_dishes.items():
    block_re = re.compile(rf'({lang}:\s*{{.*?)(\n\s*}},|\n\s*}})', re.DOTALL)
    match = block_re.search(trans)
    if match:
        block = match.group(1)
        for i in range(4):
            block = re.sub(rf'dish{i+1}_name:\s*".*?",?', f'dish{i+1}_name: "{dishes[i][0]}",', block)
            block = re.sub(rf'dish{i+1}_desc:\s*".*?",?', f'dish{i+1}_desc: "{dishes[i][1]}",', block)
        trans = trans[:match.start()] + block + match.group(2) + trans[match.end():]

with open('translations.js', 'w', encoding='utf-8') as f:
    f.write(trans)

print("Done")

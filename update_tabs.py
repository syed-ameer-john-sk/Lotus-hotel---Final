import json
import re

new_keys = {
    'tab_entrees': 'Entrées',
    'tab_plats': 'Nos Plats',
    'tab_chef': 'Spécialités du Chef',
    'tab_biryani': 'Biryani',
    'tab_vegetarian': 'Végétarien',
    'tab_kothu': 'Kothu Paratha',
    'tab_dosa': 'Dosa & Pâtes',
    'tab_pains': 'Pains & Accompagnements',
    'tab_desserts': 'Desserts & Boissons',
    'tab_formules': 'Formules & Menus'
}

en_keys = {
    'tab_entrees': 'Starters',
    'tab_plats': 'Our Dishes',
    'tab_chef': "Chef\'s Specials",
    'tab_biryani': 'Biryani',
    'tab_vegetarian': 'Vegetarian',
    'tab_kothu': 'Kothu Paratha',
    'tab_dosa': 'Dosa & Noodles',
    'tab_pains': 'Breads & Sides',
    'tab_desserts': 'Desserts & Drinks',
    'tab_formules': 'Current Menus'
}

with open('translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

fr_lines = '\n'.join([f'    "{k}": "{v}",' for k, v in new_keys.items()])
js = re.sub(r'(fr:\s*\{)', r'\1\n' + fr_lines, js)

en_lines = '\n'.join([f'    "{k}": "{v}",' for k, v in en_keys.items()])
js = re.sub(r'(en:\s*\{)', r'\1\n' + en_lines, js)

with open('translations.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Tabs translations updated')

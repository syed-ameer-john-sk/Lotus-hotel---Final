import json
import re

new_keys = {
    'sub_veg_snacks': 'Entrées Végétariennes & Snacks',
    'sub_tandoori': 'Grillades Tandoories',
    'sub_salads': 'Salades',
    'sub_curry': 'Plats Curry',
    'sub_korma': 'Plats Korma',
    'sub_vindaloo': 'Plats Vindaloo',
    'sub_madras': 'Plats Madras',
    'sub_chef_special': "Spécialités de la Maison",
    'sub_veg_plats': 'Plats Végétariens',
    'sub_formules': 'Formules & Menus',
    'menu_plats_note': 'Tous les plats sont servis avec riz nature'
}

with open('translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

lines_to_add = '\n'.join([f'    "{k}": "{v}",' for k, v in new_keys.items()])

js = re.sub(r'(fr:\s*\{)', r'\1\n' + lines_to_add, js)

en_keys = {
    'sub_veg_snacks': 'Vegetarian Starters & Snacks',
    'sub_tandoori': 'Tandoori Grills',
    'sub_salads': 'Salads',
    'sub_curry': 'Curry Dishes',
    'sub_korma': 'Korma Dishes',
    'sub_vindaloo': 'Vindaloo Dishes',
    'sub_madras': 'Madras Dishes',
    'sub_chef_special': "Chef's Specials",
    'sub_veg_plats': 'Vegetarian Dishes',
    'sub_formules': 'Set Menus',
    'menu_plats_note': 'All dishes are served with plain rice'
}
en_lines = '\n'.join([f'    "{k}": "{v}",' for k, v in en_keys.items()])
js = re.sub(r'(en:\s*\{)', r'\1\n' + en_lines, js)

with open('translations.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Translations updated')

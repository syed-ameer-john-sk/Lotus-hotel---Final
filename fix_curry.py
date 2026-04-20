import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace <div class="curry-grid"> with <div class="menu-list">
text = text.replace('<div class="curry-grid">', '<div class="menu-list">')

def replace_curry_row(match):
    name = match.group(1)
    price = match.group(2)
    return f'<div class="menu-item"><div class="menu-item-info"><div class="menu-item-name">{name}</div></div><div class="menu-dots"></div><div class="menu-price">{price}</div></div>'

text = re.sub(r'<div class="curry-row">\s*<span class="curry-name">(.*?)</span>\s*<span class="curry-price">(.*?)</span>\s*</div>', replace_curry_row, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('HTML formatting fixed')

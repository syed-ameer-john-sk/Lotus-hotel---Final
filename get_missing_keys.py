import re, json

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

html_keys = set(re.findall(r'data-i18n(?:-html|-ph)?=["\']([^"\']+)["\']', html))

fr_match = re.search(r'fr:\s*\{([^}]+)\}', js, re.DOTALL)
if fr_match:
    fr_str = fr_match.group(1)
    js_keys = set(re.findall(r'([a-zA-Z0-9_]+)\s*:', fr_str))
    js_keys_quoted = set(re.findall(r'["\']([a-zA-Z0-9_]+)["\']\s*:', fr_str))
    all_js_keys = js_keys | js_keys_quoted
    
    missing = html_keys - all_js_keys
    print("Missing keys:")
    for key in sorted(list(missing)):
        print(key)

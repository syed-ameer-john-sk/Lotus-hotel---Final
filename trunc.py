import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '<div class="gallery-masonry'
start_idx = text.find(start_marker)

if start_idx != -1:
    content_start = text.find('>', start_idx) + 1
    
    count = 1
    i = content_start
    while count > 0 and i < len(text):
        if text.startswith('<div', i):
            count += 1
        elif text.startswith('</div', i):
            count -= 1
        i += 1
    
    gallery_end = i - 6 # </div> length is 6, so we capture the content
    
    gallery_content = text[content_start:gallery_end]
    
    # We regex for all items
    items = re.findall(r'(<div class="gal-item.*?</div>\s*</div>)', gallery_content, re.DOTALL)
    
    if items:
        # Keep just 6 items
        six_items = '\n      ' + '\n      '.join(items[:6]) + '\n    '
        text = text[:content_start] + six_items + text[gallery_end:]
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(text)
        print('Items truncated to 6 successfully')

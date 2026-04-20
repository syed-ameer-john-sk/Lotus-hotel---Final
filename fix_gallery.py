import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update unsplash images in the experience section
text = text.replace('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80&fit=crop', 'gallary/unnamed (2).webp')
text = text.replace('https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&fit=crop', 'gallary/unnamed (6).webp')
text = text.replace('https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80&fit=crop', 'gallary/Lotus Food and Beverage_Dosa_1242x704.webp')

# 2. Remove Video Experience section
text = re.sub(r'<!--\s*==+\s*VIDEO EXPERIENCE\s*==+\s*-->\s*<section id="video-experience".*?</section>', '', text, flags=re.DOTALL)

# 3. Make gallery more compact (keep first 6 items)
match = re.search(r'<div class="gallery-masonry"[^\>]*>', text)
if match:
    start_pos = match.end()
    # Find the end of gallery-masonry
    end_pos = text.find('</div>\n  </div>\n</section>', start_pos)
    
    if end_pos != -1:
        gallery_content = text[start_pos:end_pos]
        
        # Split by <div class="gal-item... wait. Let's just use a simpler approach to isolate the gal items.
        # We can extract the items. Since they end before the next <div class="gal-item, we can split by <div class="gal-item
        parts = re.split(r'(<div class="gal-item)', gallery_content)
        # parts[0] is whitespace
        if len(parts) > 1:
            items = []
            for i in range(1, len(parts), 2):
                if i+1 < len(parts):
                    items.append(parts[i] + parts[i+1])
            new_content = '\n      ' + ''.join(items[:6]) + '\n    '
            text = text[:start_pos] + new_content + text[end_pos:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Done")

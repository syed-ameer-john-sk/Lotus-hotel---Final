import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract the header and footer
# We can find the start of the <section id="reservation"...>
res_start = html.find('<section id="reservation"')
res_end = html.find('</section>', res_start) + len('</section>')

if res_start != -1 and res_end != -1:
    reservation_section = html[res_start:res_end]
    
    # Create reservation.html content
    # We will split index.html at the first section
    first_section = html.find('<section id="hero">')
    if first_section == -1:
        first_section = html.find('<section ')
        
    footer_start = html.find('<footer')
    
    res_html = html[:first_section]
    # Add a small hero for the reservation page
    res_html += '''
<section id="hero" style="min-height: 40vh; display: flex; align-items: center; justify-content: center; position: relative;">
  <div class="hero-slider">
    <div class="hero-slide active" style="background-image:url('gallary/20211203_193342.webp')"></div>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content" style="padding-top: 100px;">
    <h1 class="hero-title"><em data-i18n="nav_reservation">Réservation</em></h1>
  </div>
</section>
'''
    res_html += reservation_section
    res_html += html[footer_start:]
    
    # Update links in res_html
    res_html = res_html.replace('href="#reservation"', 'href="reservation.html"')
    res_html = res_html.replace('href="#experience"', 'href="index.html#experience"')
    res_html = res_html.replace('href="#menu"', 'href="index.html#menu"')
    res_html = res_html.replace('href="#gallery"', 'href="index.html#gallery"')
    res_html = res_html.replace('href="#location"', 'href="index.html#location"')
    res_html = res_html.replace('href="#hero"', 'href="index.html#hero"')
    
    with open("reservation.html", "w", encoding="utf-8") as f:
        f.write(res_html)
    
    # Now remove reservation section from index.html
    new_index_html = html[:res_start] + html[res_end:]
    
    # Update links in index.html to point to reservation.html
    new_index_html = new_index_html.replace('href="#reservation"', 'href="reservation.html"')
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new_index_html)
    
    print("reservation.html created and index.html updated.")
else:
    print("Could not find reservation section.")

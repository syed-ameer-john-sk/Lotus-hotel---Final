import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace phone number
html = html.replace("+33652515551", "+33988420260")
html = html.replace("06 52 51 55 51", "09 88 42 02 60")
html = html.replace("06 52 51 55 51 (WhatsApp)", "09 88 42 02 60 (WhatsApp)")

# Replace address
html = html.replace("12 Rue d'Alsace-Lorraine", "24 Rue Jean Palaprat")

# Replace schedule
html = html.replace("12h–14h30 / 19h–23h", "11h30–15h00 / 18h30–23h00")
html = html.replace("Lun–Sam: 11h30–15h00 / 18h30–23h00 | Dim: 19h–23h", "Lun–Dim: 11h30–15h00 / 18h30–23h00 (Mercredi fermé)")
html = html.replace("Lun–Sam: 11h30–15h00 / 18h30–23h00<br/>Dim: 19h–23h", "Lun–Dim: 11h30–15h00 / 18h30–23h00<br/>(Mercredi fermé)")
html = html.replace('<span class="hours-day" data-i18n="loc_lun_sam">Lun – Sam</span>\n              <span data-i18n="loc_lun_sam_h">11h30–15h00 / 18h30–23h00</span>\n            </div>\n            <div class="hours-row">\n              <span class="hours-day" data-i18n="loc_dim">Dimanche</span>\n              <span data-i18n="loc_dim_h">19h–23h</span>', '<span class="hours-day" data-i18n="loc_lun_sam">Lun – Dim</span>\n              <span data-i18n="loc_lun_sam_h">11h30–15h00 / 18h30–23h00</span>\n            </div>\n            <div class="hours-row">\n              <span class="hours-day" data-i18n="loc_dim">Mercredi</span>\n              <span data-i18n="loc_dim_h">Fermé</span>')
html = html.replace('<span data-i18n="loc_lun_sam">Lun – Sam</span>\n      <span data-i18n="loc_lun_sam_h">11h30–15h00 / 18h30–23h00</span>\n    </div>\n    <div class="hero-hours-row">\n      <span data-i18n="loc_dim">Dimanche</span>\n      <span data-i18n="loc_dim_h">19h–23h</span>', '<span data-i18n="loc_lun_sam">Lun – Dim</span>\n      <span data-i18n="loc_lun_sam_h">11h30–15h00 / 18h30–23h00</span>\n    </div>\n    <div class="hero-hours-row">\n      <span data-i18n="loc_dim">Mercredi</span>\n      <span data-i18n="loc_dim_h">Fermé</span>')
html = html.replace("🕐 Lun–Sam: 11h30–15h00 / 18h30–23h00 | Dim: 19h–23h", "🕐 Lun–Dim: 11h30–15h00 / 18h30–23h00 | Mercredi: Fermé")

# Dishes updates
# 4. Have to change this name Chicken 65 AND price 6.50
# Looking for Dal Makhani Royale which uses the Chicken 65 image
old_dish4 = '''<h3 class="dish-name" data-i18n="dish4_name">Dal Makhani Royale</h3>
          <p class="dish-desc" data-i18n="dish4_desc">Lentilles noires mijotées toute une nuit avec crème et beurre clarifié.</p>
          <p class="dish-price">12.90€</p>'''
new_dish4 = '''<h3 class="dish-name" data-i18n="dish4_name">Chicken 65</h3>
          <p class="dish-desc" data-i18n="dish4_desc">Poulet mariné et frit, sauté avec poivron, oignon, ail, sauce pimentée, coriandre fraîche.</p>
          <p class="dish-price">6.50€</p>'''
html = html.replace(old_dish4, new_dish4)
html = html.replace('<div class="dish-badge" data-i18n="dish4_badge">Végétarien</div>', '<div class="dish-badge" data-i18n="dish4_badge">Spécialité</div>')

# 5. Have to change the name into biriyani
# Maybe Tandoori Mixed Grill ? It has image unnamed(4) which might be biryani? No, wait!
# If "change the name into biriyani" means something else. Let's look at "Biryani Royal à l'Agneau" and change it to just "Biriyani"
html = html.replace('Biryani Royal à l\'Agneau', 'Biriyani')

# 6. Butter chicken photo needs to replace.
# Right now Butter chicken signature has `gallary/unnamed (1).webp`.
# Let's check if there is a better butter chicken photo in `gallary`.
# I'll replace it with another file, maybe `unnamed (2).webp` or `unnamed.webp`. Let's use `unnamed.webp`.
html = html.replace('<div class="dish-img"><img src="gallary/unnamed (1).webp" alt="Butter Chicken Signature"', '<div class="dish-img"><img src="gallary/unnamed.webp" alt="Butter Chicken Signature"')

# 1. Make the letter visible and clear
# We can add a style to body to make text more readable.
# In `index.html` let's find the head and add some CSS
css_fix = """
  <style>
    body { font-size: 1.05rem; letter-spacing: 0.02em; font-weight: 400; color: #FFF; }
    p, .dish-desc, .menu-item-desc { opacity: 0.95 !important; }
    h1, h2, h3, h4, .section-title { font-weight: 600 !important; }
  </style>
"""
if css_fix not in html:
    html = html.replace('</head>', css_fix + '</head>')

# Create reservation.html
# "Keep the reservation in separate page like Gandhi Restaurant with same features"
# We will create it separately. For now, just save index.html.

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

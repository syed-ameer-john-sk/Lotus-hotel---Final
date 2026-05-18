import re

with open("translations.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace phone number
js = js.replace("+33652515551", "+33988420260")
js = js.replace("06 52 51 55 51", "09 88 42 02 60")
js = js.replace("0652515551", "0988420260")

# Replace address
js = js.replace("12 Rue d'Alsace-Lorraine", "24 Rue Jean Palaprat")

# Replace schedule
js = js.replace("12h–14h30", "11h30–15h00")
js = js.replace("Lun–Sam: 12h–14h30 / 19h–23h", "Lun–Dim: 11h30–15h00 / 18h30–23h00 (Mercredi fermé)")
js = js.replace("19h–23h", "18h30–23h00")

# Dish 4 changes: Dal Makhani Royale -> Chicken 65
js = js.replace("Dal Makhani Royale", "Chicken 65")
js = js.replace("Lentilles noires mijotées toute une nuit avec crème et beurre clarifié.", "Poulet mariné et frit, sauté avec poivron, oignon, ail, sauce pimentée, coriandre fraîche.")

# Dish 2 changes: Biryani Royal à l'Agneau -> Biriyani
js = js.replace("Biryani Royal à l'Agneau", "Biriyani")

with open("translations.js", "w", encoding="utf-8") as f:
    f.write(js)
    
print("translations.js updated.")

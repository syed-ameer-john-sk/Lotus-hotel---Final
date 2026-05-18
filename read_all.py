import sys
from pypdf import PdfReader

try:
    reader = PdfReader("C:\\Users\\syedr\\Downloads\\Lotus Restaurant Update.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text)
except Exception as e:
    print("Error reading pdf:", e)

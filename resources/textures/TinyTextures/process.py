import os 
import shutil
from PIL import Image

root = os.path.abspath(os.path.dirname(__file__))

for f, d, s in os.walk(root + os.sep + "512x512"):
    if not any(map(lambda x: x.endswith(".png"), s)):
        continue
    
    for i in s:
        src = f + os.sep + i
        dst = f.replace("512x512", "256x256") + os.sep + i
        os.makedirs(os.path.dirname(dst), exist_ok=True)

        img = Image.open(src)
        img = img.resize((256, 256), Image.LANCZOS)
        img.save(dst)

        dst = f.replace("512x512", "128x128") + os.sep + i
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        img = img.resize((128, 128), Image.ANTIALIAS)
        img.save(dst)


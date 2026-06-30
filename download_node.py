import urllib.request
import zipfile
import os

url = "https://nodejs.org/dist/v20.15.0/node-v20.15.0-win-x64.zip"
zip_path = "node.zip"
extract_path = ".node"

print("Downloading portable Node.js v20.15.0...")
urllib.request.urlretrieve(url, zip_path)
print("Downloading complete. Extracting zip file...")

os.makedirs(extract_path, exist_ok=True)
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print("Extraction complete. Cleaning up zip file...")
os.remove(zip_path)
print("Node.js portable installation finished successfully!")

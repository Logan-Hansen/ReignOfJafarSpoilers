import os
import json

# Configuration
main_dir = "cards"
bonus_dir = os.path.join(main_dir, "bonus")
output_file = "manifest.json"

# Gather main set cards like 001.png
revealed = sorted(
    f[:-4] for f in os.listdir(main_dir)
    if f.endswith(".png") and f[:-4].isdigit()
)

# Gather bonus cards like bonus_01.png
bonus = sorted(
    f.replace("bonus_", "").replace(".png", "")
    for f in os.listdir(bonus_dir)
    if f.startswith("bonus_") and f.endswith(".png")
)

# Output manifest
manifest = {
    "revealed": revealed,
    "bonus": bonus
}

with open(output_file, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"✓ Manifest saved to {output_file} with {len(revealed)} revealed and {len(bonus)} bonus cards.")

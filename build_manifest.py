import os
import json

# Configuration
main_dir = "cards"
lowres_dir = os.path.join(main_dir, "lowRes")
bonus_dir = os.path.join(main_dir, "bonus")
output_file = "manifest.json"

# Find all card numbers in high-res and low-res
high_res = {
    f[:-4] for f in os.listdir(main_dir)
    if f.endswith(".png") and f[:-4].isdigit()
}

low_res = {
    f[:-4] for f in os.listdir(lowres_dir)
    if f.endswith(".png") and f[:-4].isdigit()
}

# Combine sets, prioritizing high-res
all_cards = sorted(high_res | low_res)

# Bonus logic unchanged
bonus = sorted(
    f.replace("bonus_", "").replace(".png", "")
    for f in os.listdir(bonus_dir)
    if f.startswith("bonus_") and f.endswith(".png")
)

# Output
manifest = {
    "revealed": all_cards,
    "bonus": bonus
}

with open(output_file, "w") as f:
    json.dump(manifest, f, indent=2)

print(f"✓ Manifest saved to {output_file} with {len(all_cards)} revealed and {len(bonus)} bonus cards.")

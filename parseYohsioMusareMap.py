import requests

def download_maps(base_url, start, end):
    maps = []
    for i in range(start, end + 1):
        url = f"{base_url}soko{str(i).zfill(3)}.txt"
        response = requests.get(url)
        if response.status_code == 200:
            maps.append(response.text)
        else:
            print(f"Failed to download map {i}")
    return maps

def parse_map(text):
    # Define new mapping from characters to integers
    mapping = {'#': 3, ' ': 4, '*': 5, '.': 1, '@': 0, '$': 2}
    return [[mapping.get(char, 4) for char in line] for line in text.splitlines() if line.strip()]

def format_as_javascript(levels):
    formatted_levels = ',\n    '.join(f'{k+1}: {v}' for k, v in enumerate(levels))
    return (
        f'class Map {{\n'
        f'  static levels = {{\n    {formatted_levels}\n  }};\n\n'
        f'  static getInitialState(level) {{\n'
        f'    return Map.levels[level]\n'
        f'      ? JSON.parse(JSON.stringify(Map.levels[level]))\n'
        f'      : null;\n'
        f'  }}\n\n'
        f'  static getTotalLevels() {{\n'
        f'    return Object.keys(Map.levels).length;\n'
        f'  }}\n'
        f'}}'
    )

def main():
    base_url = 'https://www.ne.jp/asahi/ai/yoshio/sokoban/auto52/'
    maps = download_maps(base_url, 1, 52)  # Download maps from soko001.txt to soko052.txt
    parsed_maps = [parse_map(map_text) for map_text in maps]
    js_code = format_as_javascript(parsed_maps)
    with open('MapYohsio.js', 'w') as file:
        file.write(js_code)

if __name__ == '__main__':
    main()

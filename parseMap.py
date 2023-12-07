def parse_map(text):
    # Define your mapping from characters to integers
    mapping = {'X': 3, ' ': 4, '*': 2, '.': 1, '@': 0}
    return [[mapping.get(char, 4) for char in line] for line in text.splitlines() if line.strip()]

def parse_file(filename):
    with open(filename, 'r') as file:
        content = file.read()

    levels = {}
    for level_data in content.split("*************************************")[1:]:
        lines = level_data.strip().split('\n')
        if len(lines) < 7:  # Check if there are enough lines for a level
            continue

        # Safely get the level number
        try:
            level_number = int(lines[0].split(':')[1].strip())
        except (IndexError, ValueError):
            continue  # Skip this level if it can't be parsed

        map_text = '\n'.join(lines[6:]) 
        levels[level_number] = parse_map(map_text)

    return levels

def format_as_javascript(levels):
    formatted_levels = ',\n    '.join(f'{k}: {v}' for k, v in levels.items())
    return (
        f'class Map {{\n'
        f'  static levels = {{\n    {formatted_levels}\n  }};\n\n'
        f'  // Return a deep copy of the level array\n'
        f'  static getInitialState(level) {{\n'
        f'    return Map.levels[level]\n'
        f'      ? JSON.parse(JSON.stringify(Map.levels[level]))\n'
        f'      : null;\n'
        f'  }}\n\n'
        f'  // Method to get the total number of levels\n'
        f'  static getTotalLevels() {{\n'
        f'    return Object.keys(Map.levels).length;\n'
        f'  }}\n'
        f'}}'
    )


def write_to_file(js_code, output_filename):
    with open(output_filename, 'w') as file:
        file.write(js_code)

def main():
    input_filename = 'sokobanmaps.txt'  # Your input file
    output_filename = 'Map.js'  # Your output file

    levels = parse_file(input_filename)
    js_code = format_as_javascript(levels)
    write_to_file(js_code, output_filename)

if __name__ == '__main__':
    main()

import os

def parse_map(text):
    # Define new mapping from characters to integers
    mapping = {'#': 3, ' ': 4, '*': 5, '.': 1, '@': 0, '$': 2, '+': 6}
    valid_board_chars = set(mapping.keys())  # Set of characters that are valid for the game board

    # Split text into lines
    lines = text.splitlines()
    board_lines = []

    max_length = 0
    for line in lines:
        stripped_line = line.rstrip()

        # Check if the line contains only valid board characters or spaces
        if all(char in valid_board_chars or char == ' ' for char in stripped_line):
            # Line is part of the game board
            board_lines.append([mapping.get(char, 4) for char in stripped_line])
            max_length = max(max_length, len(stripped_line))
        else:
            # Line contains characters not part of the game board, stop parsing
            break

    # Pad shorter lines with spaces (4)
    for line in board_lines:
        line.extend([4] * (max_length - len(line)))

    return board_lines


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

def read_maps_from_directory(directory, start, end):
    maps = []
    for i in range(start, end + 1):
        filename = f"soko{str(i).zfill(3)}.txt"
        file_path = os.path.join(directory, filename)

        if os.path.exists(file_path):
            # Try multiple encodings
            for encoding in ['utf-8', 'Shift_JIS', 'cp1252']:
                try:
                    with open(file_path, 'r', encoding=encoding) as file:
                        content = file.read()
                        maps.append(content)
                        break  # If successful, exit the encoding loop
                except UnicodeDecodeError:
                    continue  # If error, try next encoding
            else:
                print(f"Failed to decode file: {file_path}")
        else:
            print(f"File not found: {file_path}")
    return maps


def main():
    # Directory paths
    autogen_dir = 'SokobanMaps/AutoGen'
    handmade_dir = 'SokobanMaps/Handmade'

    # Read and parse AutoGen maps
    autogen_maps = read_maps_from_directory(autogen_dir, 1, 52)
    parsed_autogen_maps = [parse_map(map_text) for map_text in autogen_maps]
    autogen_js_code = format_as_javascript(parsed_autogen_maps)
    with open('MapAutoGen.js', 'w') as file:
        file.write(autogen_js_code)

    # Read and parse Handmade maps
    handmade_maps = read_maps_from_directory(handmade_dir, 1, 54)
    parsed_handmade_maps = [parse_map(map_text) for map_text in handmade_maps]
    handmade_js_code = format_as_javascript(parsed_handmade_maps)
    with open('MapHandmade.js', 'w') as file:
        file.write(handmade_js_code)

if __name__ == '__main__':
    main()

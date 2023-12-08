import os

def clean_map_files(directory, start, end):
    for i in range(start, end + 1):
        filename = f"soko{str(i).zfill(3)}.txt"
        file_path = os.path.join(directory, filename)

        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()

            # Filter out blank lines
            cleaned_lines = [line for line in lines if line.rstrip()]

            with open(file_path, 'w', encoding='utf-8') as file:
                file.writelines(cleaned_lines)
        else:
            print(f"File not found: {file_path}")

def main():
    autogen_dir = 'SokobanMaps/AutoGen'
    handmade_dir = 'SokobanMaps/Handmade'

    # Clean AutoGen maps
    clean_map_files(autogen_dir, 1, 52)

    # Clean Handmade maps
    clean_map_files(handmade_dir, 1, 54)

if __name__ == '__main__':
    main()

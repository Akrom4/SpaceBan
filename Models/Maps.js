class Map {
  // Define levels as a static property
  static levels = {
    1: [
      [3, 3, 3, 3, 3, 3, 3, 3],
      [3, 0, 4, 2, 1, 4, 4, 3],
      [3, 4, 4, 2, 1, 4, 4, 3],
      [3, 4, 4, 2, 1, 4, 4, 3],
      [3, 4, 4, 2, 1, 4, 4, 3],
      [3, 3, 3, 3, 3, 3, 3, 3],
    ],
    2: [
      [3, 3, 3, 3, 3, 3, 3, 3],
      [3, 0, 4, 2, 1, 4, 4, 3],
      [3, 3, 3, 3, 3, 3, 3, 3],
    ],
  };

  // Return a deep copy of the level array
  static getInitialState(level) {
    return Map.levels[level]
      ? JSON.parse(JSON.stringify(Map.levels[level]))
      : null;
  }

  // Method to get the total number of levels
  static getTotalLevels() {
    return Object.keys(Map.levels).length;
  }
}

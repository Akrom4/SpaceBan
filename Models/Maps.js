class Map {
  // Return a deep copy of the level array
  static getInitialState(level) {
    const levels = {
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
    return levels[level] ? JSON.parse(JSON.stringify(levels[level])) : null;
  }
}

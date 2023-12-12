/**
 * Model for the SokoPac game
 * Handles the game logic
 */
class SokoPacModel {
  constructor() {
    this.squares = [];
    this.winConditionArray = [];
    this.level = 1;
    this.moveHistory = [];
    this.moveCount = 0;
    this.mapCollection = null;
  }

  /* Square array legend
          0 -> PacMan
          1 -> Dot
          2 -> Box
          3 -> Wall
          4 -> Empty
          5 -> Box on Dot
          6 -> PacMan on Dot
      */
  setMapCollection(mapCollection) {
    this.mapCollection = mapCollection;
  }
  //
  loadLevel(level) {
    this.level = level;
    let initialState = this.mapCollection.getLevel(level);
    if (initialState) {
      this.squares = initialState;
      this.winConditionArray = this.winCondition();
      this.moveHistory = [];
      this.moveCount = 0;
    } else {
      console.error("Level not found: " + level);
    }
  }

  // Movement handling
  move(dirMove) {
    // Pacman or Pacman on a dot position
    let rowIndex = this.squares.findIndex(
      (row) => row.includes(0) || row.includes(6)
    );
    let columnIndex = this.squares[rowIndex].findIndex(
      (col) => col === 0 || col === 6
    );
    // Pacman destination position
    let destinationRow = rowIndex + dirMove[1];
    let destinationColumn = columnIndex + dirMove[0];
    let destination = this.squares[destinationRow][destinationColumn];
    // Store the current state of the square PacMan is leaving
    let currentSquare = this.squares[rowIndex][columnIndex];

    // Check if the destination is not a Wall and within grid boundaries
    if (
      destination !== 3 &&
      this.isValidPosition(destinationRow, destinationColumn)
    ) {
      // Handle Box Movement
      if (destination === 2 || destination === 5) {
        let nextDestinationRow = destinationRow + dirMove[1];
        let nextDestinationColumn = destinationColumn + dirMove[0];

        // Check for valid next position
        if (this.isValidPosition(nextDestinationRow, nextDestinationColumn)) {
          let nextDestination =
            this.squares[nextDestinationRow][nextDestinationColumn];

          // Handle moving the box
          if (
            nextDestination !== 3 &&
            nextDestination !== 2 &&
            nextDestination !== 5
          ) {
            this.moveHistory.push(JSON.parse(JSON.stringify(this.squares)));
            this.moveCount++;
            // Update current and next positions of the box
            this.squares[nextDestinationRow][nextDestinationColumn] =
              nextDestination === 1 ? 5 : 2;
            this.squares[destinationRow][destinationColumn] =
              destination === 5 ? 6 : 0; // Restore Dot if Box was on Dot
            this.squares[rowIndex][columnIndex] = currentSquare === 6 ? 1 : 4; // Restore Dot if PacMan was on Dot
            this.onMove();
          }
        }
      } else {
        this.moveHistory.push(JSON.parse(JSON.stringify(this.squares)));
        this.moveCount++;
        // Handle PacMan Movement
        this.squares[destinationRow][destinationColumn] =
          destination === 1 ? 6 : 0;
        this.squares[rowIndex][columnIndex] = currentSquare === 6 ? 1 : 4;
        this.onMove();
      }
    }
    if (this.checkWinCondition()) {
      this.onWin();
    }
  }
  // MUndo the last move
  undoMove() {
    if (this.moveHistory.length > 0) {
      this.squares = this.moveHistory.pop(); // Revert to the last state
      this.moveCount--; // Decrement move count
      this.onMove(); // Update the UI
    }
  }

  //
  isValidPosition(row, column) {
    return (
      row >= 0 &&
      row < this.squares.length &&
      column >= 0 &&
      column < this.squares[row].length
    );
  }

  // Win condition check
  checkWinCondition() {
    let win = true;
    this.winConditionArray.forEach((dot) => {
      if (this.squares[dot[0]][dot[1]] !== 5) {
        win = false;
      }
    });
    return win;
  }

  // Win condition initialization
  winCondition() {
    let winConditionArray = [];
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[i].length; j++) {
        if (this.squares[i][j] === 1 || this.squares[i][j] === 5) {
          winConditionArray.push([i, j]); // Add dot and box-on-dot coordinates to the winCondition array
        }
      }
    }
    return winConditionArray;
  }

  // Notifies the ViewModel that the game is won
  setWinCallback(callback) {
    this.onWin = callback;
  }

  // Notifies the ViewModel that a move has been played
  setMoveCallback(callback) {
    this.onMove = callback;
  }

  // Restart the game board to its initial state
  resetBoard() {
    this.loadLevel(this.level);
    this.moveHistory = [];
    this.moveCount = 0;
  }
}

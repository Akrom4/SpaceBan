class Pac {
  constructor(position = null) {
    this.position = position;
  }

  setPosition(position) {
    this.position = position;
  }
  getPosition() {
    return this.position;
  }
  getPositionRow() {
    return this.position[0];
  }
  getPositionColumn() {
    return this.position[1];
  }
}

/**
 * View class for the SokoPac game
 * Handles the user interface rendering
 */
class SokoPacView {
  constructor(viewModel) {
    this.viewModel = viewModel; // Bind the ViewModel to the View
    this.keyEvent = this.keyEvent.bind(this); // Bind keyEvent to the object, enables the possibility to remove an arrow function from the event listener
    this.initUI();
    this.updateUI();
  }

  // Create the menu and the event listeners
  initUI() {
    document.getElementById("app").innerHTML = this.userInterface();
    this.bindKeyEvents();
    this.addResetEvent();
  }

  // Add the gameMenu and the gameGrid divs
  userInterface() {
    let content = ` <div id="gameInfo">
                        <button id="reset" class="button">Reset</button>
                    </div>                      
                    <div id="gameGrid"></div>
                  `;
    return content;
  }

  // Keyboard arrows event listeners
  keyEvent(event) {
    switch (event.key) {
      case "ArrowLeft":
        this.viewModel.handleMove([-1, 0]);
        break;
      case "ArrowRight":
        this.viewModel.handleMove([1, 0]);
        break;
      case "ArrowUp":
        this.viewModel.handleMove([0, -1]);
        break;
      case "ArrowDown":
        this.viewModel.handleMove([0, 1]);
        break;
    }
  }

  // Add the keyboard arrows event listeners
  bindKeyEvents() {
    window.addEventListener("keydown", this.keyEvent);
  }

  // Remove the keyboard arrows event listeners
  removeKeyEvents() {
    window.removeEventListener("keydown", this.keyEvent);
  }

  // Add the reset event listener on the reset button
  addResetEvent() {
    document.getElementById("reset").addEventListener("click", () => {
      this.viewModel.handleReset();
    });
  }

  // Game grid creation and update
  updateUI() {
    const boardDiv = document.getElementById("gameGrid"); // Get the 'gameGrid' div element

    // Calculate grid size based on the number of squares
    let gridSize = this.viewModel.model.squares[0].length * 5;
    boardDiv.style.maxWidth = gridSize + "vmin";

    // Update the inner HTML of the 'gameGrid' div with the current game state
    boardDiv.innerHTML = this.toHTML();
  }

  // Grid rendering
  toHTML() {
    let content = "";
    this.viewModel.model.squares.forEach((row) => {
      row.forEach((square) => {
        content += ` <div class="squareWrap"><div class="square square${square}"></div></div>`; // Add the correct css class to a square
      });
    });
    return content;
  }

  // Win handling
  showWinMessage() {
    // Show a win message or screen to the player
    setTimeout(() => {
      alert("Congratulations! You've won!");
    }, "100");
  }
}

/**
 * ViewModel for the SokoPac game
 * Link between Model and View
 * Retrieves data from Model and exposes it to the View
 * Retrieves user inputs and exposes it to the Model
 */
class SokoPacViewModel {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.model.setMoveCallback(() => this.onModelUpdated()); // Notifies the ViewModel to update the User Interface
    this.model.setWinCallback(() => this.onModelWin()); // Notifies the ViewModel that the game is finished
  }

  // Update the UI when the model changes
  onModelUpdated() {
    if (this.view) {
      this.view.updateUI();
    }
  }

  // Notify the view that the player has won, remove the keyboard arrow events
  onModelWin() {
    if (this.view) {
      this.view.removeKeyEvents();
      this.view.showWinMessage();
    }
  }

  // Bind the View to the ViewModel
  setView(view) {
    this.view = view;
  }

  // Move handling
  handleMove(direction) {
    this.model.move(direction);
    this.view.updateUI();
  }

  // Restart the game to it's initial state
  handleReset() {
    this.model.resetBoard();
    this.view.bindKeyEvents();
    this.view.updateUI();
  }
}

/**
 * Model for the SokoPac game
 * Handles the game logic
 */
class SokoPacModel {
  constructor() {
    this.squares = this.initBoard();
    this.winConditionArray = this.winCondition();
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

  // Square array that depicts the map
  initBoard() {
    return [
      [3, 3, 3, 3, 3, 3, 3],
      [3, 0, 4, 2, 1, 4, 3],
      [3, 3, 3, 3, 3, 3, 3],
    ];
  }

  // Movement handling
  move(dirMove) {
    // Pacman position To replace when Pac class is implemented
    let rowIndex = this.squares.findIndex((row) => row.includes(0));
    let columnIndex = this.squares[rowIndex].findIndex((col) => col === 0);
    let nextRow = rowIndex + dirMove[1];
    let nextColumn = columnIndex + dirMove[0];
    let nextSquare = this.squares[nextRow][nextColumn];

    // Check if the next square is not a Wall
    if (nextSquare !== 3) {
      // If next square is a Box and the square after it is not a Box or Wall
      if (nextSquare === 2 || nextSquare === 5) {
        let afterNextRow = nextRow + dirMove[1];
        let afterNextColumn = nextColumn + dirMove[0];
        let afterNextSquare = this.squares[afterNextRow][afterNextColumn];

        if (
          afterNextSquare !== 3 &&
          afterNextSquare !== 2 &&
          afterNextSquare !== 5
        ) {
          // Move PacMan to the Box's position, and move the Box forward
          this.squares[rowIndex][columnIndex] = 4;
          this.squares[nextRow][nextColumn] = 0;
          if (afterNextSquare === 1) {
            this.squares[afterNextRow][afterNextColumn] = 5;
          } else {
            this.squares[afterNextRow][afterNextColumn] = 2;
          }

          this.onMove();
        }
      } else {
        // Move PacMan to the next square if it's not a Box or Wall
        this.squares[rowIndex][columnIndex] = 4;
        this.squares[nextRow][nextColumn] = 0;
        this.onMove();
      }
    }
    if (this.checkWinCondition()) {
      this.onWin();
    }
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
      for (let j = 0; j < this.squares[0].length; j++) {
        if (this.squares[i][j] === 1) {
          winConditionArray.push([i, j]); // Add dots coordinates to the winCondition array
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
    this.squares = this.initBoard();
  }
}

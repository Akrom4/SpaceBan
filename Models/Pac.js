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
class SokoPacView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    
    this.initUI();
    this.updateUI();
  }

  initUI() {
    document.getElementById("app").innerHTML = this.userInterface();
    this.bindKeyEvents();
    this.addResetEvent();
  }

  bindKeyEvents() {
    window.addEventListener("keydown", (event) => {
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
    });
  }
  removeKeyEvents(){
    window.removeEventListener("keydown", keyEvent());
  }
  userInterface() {
    let content = ` <div id="gameInfo">
                        <button id="reset" class="button">Reset</button>
                    </div>                      
                    <div id="gameGrid"></div>
                  `;
    return content;
  }
  addResetEvent() {
    document.getElementById("reset").addEventListener("click", () => {
      this.viewModel.handleReset();
    });
  }

  updateUI() {
    // Get the 'gameGrid' div element
    const boardDiv = document.getElementById("gameGrid");

    // Calculate grid size based on the number of squares
    let gridSize = this.viewModel.model.squares[0].length * 5;
    boardDiv.style.maxWidth = gridSize + "vmin";

    // Update the inner HTML of the 'gameGrid' div with the current game state
    boardDiv.innerHTML = this.toHTML();
  }
  toHTML() {
    let content = "";
    this.viewModel.model.squares.forEach((row) => {
      row.forEach((square) => {
        content += ` <div class="squareWrap"><div class="square square${square}"></div></div>`;
      });
    });
    return content;
  }
  showWinMessage() {
    // Show a win message or screen to the player
    setTimeout(() => {
        alert("Congratulations! You've won!");
      }, "100");
  }
}
class SokoPacViewModel {
  constructor(model) {
    this.model = model;
    this.view = null;
    this.model.setMoveCallback(() => this.onModelUpdated());
    this.model.setWinCallback(() => this.onModelWin());
  }

  onModelUpdated() {
    // Update the UI when the model changes
    if (this.view) {
      this.view.updateUI();
    }
  }

  onModelWin() {
    // Notify the view that the player has won
    if (this.view) {
        this.view.removeKeyEvents();
      this.view.showWinMessage();
    }
  }

  setView(view) {
    this.view = view;
  }

  handleMove(direction) {
    this.model.move(direction);
    this.view.updateUI();
  }

  handleReset() {
    this.model.resetBoard();
    this.view.updateUI();
  }
}

class SokoPacModel {
  constructor() {
    this.squares = this.initBoard();
    this.winConditionArray = this.winCondition();
  }

  /* Square array 
        0 -> PacMan
        1 -> Dot
        2 -> Box
        3 -> Wall
        4 -> Empty
        5 -> Box on Dot
        6 -> PacMan on Dot
    */
  initBoard() {
    return [
      [3, 3, 3, 3, 3, 3, 3],
      [3, 0, 4, 2, 1, 4, 3],
      [3, 4, 4, 2, 1, 4, 3],
      [3, 4, 4, 2, 1, 4, 3],
      [3, 4, 4, 2, 1, 4, 3],
      [3, 4, 4, 2, 1, 4, 3],
      [3, 3, 3, 3, 3, 3, 3],
    ];
  }

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

        if (afterNextSquare !== 3 && afterNextSquare !== 2 && afterNextSquare !== 5) {
          // Move PacMan to the Box's position, and move the Box forward
          this.squares[rowIndex][columnIndex] = 4;
          this.squares[nextRow][nextColumn] = 0;
          if(afterNextSquare === 1){
            this.squares[afterNextRow][afterNextColumn] = 5;
          }
          else{
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

  checkWinCondition() {
    let win = true;
    this.winConditionArray.forEach((dot) => {
      if (this.squares[dot[0]][dot[1]] !== 5) {
        win = false;
      }
    });
    return win;
  }

  winCondition() {
    console.log(this.squares.length);
    console.log(this.squares[0].length);
    let winConditionArray = [];
    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[0].length; j++) {
        if (this.squares[i][j] === 1) {
          winConditionArray.push([i, j]);
        }
      }
    }
    console.log(winConditionArray);
    return winConditionArray;
  }

  setWinCallback(callback) {
    this.onWin = callback;
  }

  setMoveCallback(callback) {
    this.onMove = callback;
  }
  resetBoard() {
    this.squares = this.initBoard();
  }
}

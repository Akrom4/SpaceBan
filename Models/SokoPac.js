class SokoPac {
  /* Square array 
        0 -> PacMan
        1 -> Dot
        2 -> Box
        3 -> Wall
        4-> Empty
    */
  squares = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
    [3, 1, 1, 4, 4, 3, 4, 4, 4, 4, 4, 3, 3, 3],
    [3, 1, 1, 4, 4, 3, 4, 2, 4, 4, 2, 4, 4, 3],
    [3, 1, 1, 4, 4, 3, 2, 3, 3, 3, 3, 4, 4, 3],
    [3, 1, 1, 4, 4, 4, 4, 0, 4, 3, 3, 4, 4, 3],
    [3, 1, 1, 4, 4, 3, 4, 3, 4, 4, 2, 4, 3, 3],
    [3, 3, 3, 3, 3, 3, 4, 3, 3, 2, 4, 2, 4, 3],
    [4, 4, 3, 4, 2, 4, 4, 2, 4, 2, 4, 2, 4, 3],
    [4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 3],
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  ];

  constructor() {
    console.log("SokoPac Class Init");
    this.history = [];
    document.getElementById(
      "app"
    ).innerHTML = ` <div id="gameInterface">interface</div>
                    <div id="gameGrid"></div>
                  `;
    this.render();
    window.addEventListener("keydown", (event) => {
      if (event.key == "ArrowLeft") {
        this.move([-1, 0]);
      } else if (event.key == "ArrowRight") {
        this.move([1, 0]);
      } else if (event.key == "ArrowUp") {
        this.move([0, -1]);
      } else if (event.key == "ArrowDown") {
        this.move([0, 1]);
      }
    });
  }

  render() {
    // Get the divs for user interface and game board
    const userInterfaceDiv = document.getElementById("gameInterface");
    const boardDiv = document.getElementById("gameGrid");

    // Render the user interface and the game grid
    userInterfaceDiv.innerHTML = this.userInterface();
    let gridSize = this.squares[0].length * 5;
    boardDiv.style.maxWidth = gridSize + "vmin";
    boardDiv.innerHTML = this.toHTML();
  }

  userInterface() {
    console.log("UI Init");
    let content = ` <div id="gameInfo">
                        <p>Objectif manger toutes les dots !</p>
                    </div>                      
                  `;
    return content;
  }

  toHTML() {
    let content = "";
    this.squares.forEach((row) => {
      row.forEach((square) => {
        content += ` <div class="squareWrap"><div class="square square${square}"></div></div>`;
      });
    });

    return content;
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
      if (nextSquare === 2) {
        let afterNextRow = nextRow + dirMove[1];
        let afterNextColumn = nextColumn + dirMove[0];
        let afterNextSquare = this.squares[afterNextRow][afterNextColumn];

        if (afterNextSquare !== 3 && afterNextSquare !== 2) {
          // Move PacMan to the Box's position, and move the Box forward
          this.squares[rowIndex][columnIndex] = 4;
          this.squares[nextRow][nextColumn] = 0;
          this.squares[afterNextRow][afterNextColumn] = 2;
          this.render();
        }
      } else {
        // Move PacMan to the next square if it's not a Box or Wall
        this.squares[rowIndex][columnIndex] = 4;
        this.squares[nextRow][nextColumn] = 0;
        this.render();
      }
    }
  }
  undoMove() {}
}

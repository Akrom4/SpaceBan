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
    console.log("move");
    let rowIndex = this.squares.findIndex((row) => row.includes(0));
    let columnIndex = this.squares[rowIndex].findIndex((col) => col === 0);
    
    if(this.squares[rowIndex + dirMove[1]][columnIndex + dirMove[0]] !== 3) {
        this.squares[rowIndex][columnIndex] = 4;
        this.squares[rowIndex + dirMove[1]][columnIndex + dirMove[0]] = 0;
        this.render();
    }
    
  }

  undoMove() {

  }


}

/**
 * View class for the SokoPac game
 * Handles the user interface rendering
 */
class SokoPacView {
  constructor(viewModel) {
    this.viewModel = viewModel; // Bind the ViewModel to the View
    this.keyEvent = this.keyEvent.bind(this); // Bind keyEvent to the object, enables the possibility to remove an arrow function from the event listener
  }

  // Create the menu and the event listeners
  initUI() {
    document.getElementById("app").innerHTML = this.userInterface();
    this.bindKeyEvents();
    this.addResetEvent();
    this.addMenuEvent();
    this.addUndoEvent();
  }

  // Add the gameMenu and the gameGrid divs
  userInterface() {
    let content = ` <div id="gameInfo">
                          <button id="menu" class="button button-green">Menu</button>
                          <button id="undo" class="button">Undo</button>
                          <button id="reset" class="button">Reset</button>
                          <div id="moveCount"></div>
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

  //
  addMenuEvent() {
    document.getElementById("menu").addEventListener("click", () => {
      this.viewModel.handleMenu();
    });
  }
  //
  addUndoEvent() {
    document.getElementById("undo").addEventListener("click", () => {
      this.viewModel.handleUndo();
    });
  }
  updateUI() {
    const boardDiv = document.getElementById("gameGrid");
    const moveCountDiv = document.getElementById("moveCount");
    if (moveCountDiv) {
      moveCountDiv.textContent = "Moves: " + this.viewModel.model.moveCount;
    }
  
    // Calculate the size of each square and the number of columns
    const numColumns = this.viewModel.model.squares[0].length;
    const squareSize = Math.min(90 / numColumns, 5); // Calculate size, but not larger than 5vmin
  
    // Set grid template columns based on the number of columns
    boardDiv.style.gridTemplateColumns = `repeat(${numColumns}, ${squareSize}vmin)`;
  
    // Render the grid cells
    boardDiv.innerHTML = this.toHTML(squareSize);
  }
  
  // Grid rendering with dynamic square size
  toHTML(squareSize) {
    let content = "";
    this.viewModel.model.squares.forEach((row) => {
      row.forEach((square) => {
        square = square === 6 ? 0 : square;
        content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                      <div class="square square${square}" style="width: ${squareSize * 0.8}vmin; height: ${squareSize * 0.8}vmin;"></div>
                    </div>`;
      });
    });
    return content;
  }
  toHTML(squareSize) {
    let content = "";
    this.viewModel.model.squares.forEach((row) => {
      row.forEach((square) => {
        square = square === 6 ? 0 : square;
        let sizeMultiplier = square === 1 ? 0.3 : 0.8; // Reduce size for square1
        let adjustedSize = squareSize * sizeMultiplier;
        content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                      <div class="square square${square}" style="width: ${adjustedSize}vmin; height: ${adjustedSize}vmin;"></div>
                    </div>`;
      });
    });
    return content;
  }
  

  //
  renderLevelSelectionMenu() {
    const clearedLevels = this.viewModel.getClearedLevels();
    const totalLevels = Map.getTotalLevels();
  
    let menuContent = `<div id="levelMenuContainer">
                         <div id="menuHeader"><h2>Select Level</h2></div>
                         <div id="levelSelection">`;
  
    for (let level = 1; level <= totalLevels; level++) {
      const isCleared = clearedLevels.includes(level.toString());
      menuContent += `<button class="level-btn button ${
        isCleared ? "button-green" : ""
      }" data-level="${level}">${level}</button>`;
    }
  
    menuContent += `</div></div>`;
    document.getElementById("app").innerHTML = menuContent;
    this.bindLevelSelectionEvents();
  }
  
  //
  bindLevelSelectionEvents() {
    const levelButtons = document.querySelectorAll(".level-btn");
    levelButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const selectedLevel = event.target.getAttribute("data-level");
        this.viewModel.handleLevelSelection(selectedLevel);
      });
    });
  }
  // Win handling
  showWinMessage() {
    // Show a win message or screen to the player
    setTimeout(() => {
      alert("Congratulations! You've won!");
    }, "1");
  }
}

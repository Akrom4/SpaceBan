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
  // Game grid creation and update
  updateUI() {
    const boardDiv = document.getElementById("gameGrid"); // Get the 'gameGrid' div element
    const moveCountDiv = document.getElementById("moveCount");
    if (moveCountDiv) {
      moveCountDiv.textContent = "Moves: " + this.viewModel.model.moveCount;
    }
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
        square = square === 6 ? 0 : square;
        content += ` <div class="squareWrap"><div class="square square${square}"></div></div>`; // Add the correct css class to a square
      });
    });
    return content;
  }

  //
  renderLevelSelectionMenu() {
    const clearedLevels = this.viewModel.getClearedLevels();
    console.log(clearedLevels);
    const totalLevels = Map.getTotalLevels();
    console.log(totalLevels);
  
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

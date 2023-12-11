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
    const squareSize = Math.min(90 / numColumns, 10); // Calculate size, but not larger than 5vmin

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
            let sizeMultiplier = square === 1 ? 0.3 : 0.8; // Reduce size for square1
            let adjustedSize = squareSize * sizeMultiplier;

            if (square === 0) {
                // Render an <img> for the robot inside square0 and then render square1 (dot)
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square0" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/robot.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                </div>
                            </div>`;
            } else if (square === 6) {
                // Render an <img> for the robot inside square0 and then render square1 (dot)
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square0" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/robot.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                    <div class="square square1" style="width: ${squareSize * 0.3}vmin; height: ${squareSize * 0.3}vmin; z-index: 1; position: absolute;"></div>
                                </div>
                            </div>`;
            }else if (square === 2) {
                // Render an <img> for the robot inside square0 and then render square1 (dot)
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square2" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/alienWin.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                </div>
                            </div>`;
            } else if (square === 5) {
                // Render an <img> for the robot inside square0 and then render square1 (dot)
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square5" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/alien.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                    <div class="square square1" style="width: ${squareSize * 0.3}vmin; height: ${squareSize * 0.3}vmin; z-index: 1; position: absolute;"></div>
                                </div>
                            </div>`;
            
            } else if (square === 3){
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square${square}" style="width: ${adjustedSize}vmin; height: ${adjustedSize}vmin;">
                                    <span></span><span></span>
                                    <div class="square3-display">
                                        <div class="square3-content"></div>
                                    </div>
                                </div>
                            </div>`;
            } else {
                // Render other squares normally
                content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square${square}" style="width: ${adjustedSize}vmin; height: ${adjustedSize}vmin;"></div>
                            </div>`;
            }
        });
    });
    return content;
}


  //
  renderStartMenu() {
    let startMenuContent = `
    <div id="startMenu">
    <div class="glowingRGB">
        <span></span>
        <span></span>
        <div class="display">
            <div id="menuTitle">SELECT COLLECTION</div>
        </div>
    </div>
    <div id="mapChoices" class="map-choice-container">
        <div class="button-container">
            <button id="original" class="menu-button button map-choice">
                <span></span>
                <span></span>
                <div class="button-display">
                    <div class="button-content">Original</div>
                </div>
            </button>
            <p class="button-description">Play the Classic Sokoban maps</p>
        </div>
        <div class="button-container">
            <button id="autoGen" class="menu-button button map-choice">
                <span></span>
                <span></span>
                <div class="button-display">
                    <div class="button-content">Auto Gen</div>
                </div>
            </button>
            <p class="button-description">Despite their small size (8*8) and having only 3 boxes, these AI-assisted creations can be quite challenging !</p>
        </div>
        <div class="button-container">
            <button id="tricky" class="menu-button button map-choice">
                <span></span>
                <span></span>
                <div class="button-display">
                    <div class="button-content">Yoshio</div>
                </div>
            </button>
            <p class="button-description">Enjoy the intricately designed layouts created by Yoshio Murase</p>
        </div>
    </div>
  </div>
  
    `;
    document.getElementById("app").innerHTML = startMenuContent;
    this.bindStartMenuEvents();
  }
  
   //
   bindStartMenuEvents() {
    const buttons = document.querySelectorAll(".menu-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        console.log(event.currentTarget.id);
        switch (event.currentTarget.id) {
          case 'createMapButton':
            // Handle the 'Create Map' button click here
            console.log('Create Map button clicked');
            break;
          case 'original':
            this.renderLevelSelectionMenu(event.target.id);
            break;
          case 'autoGen':
            this.renderLevelSelectionMenu(event.target.id);
            break;
          case 'tricky':
            // Pass the map collection option to the renderLevelSelectionMenu
            this.renderLevelSelectionMenu(event.target.id);
            break;
          default:
            // Optional: Handle any other case or log an error
            console.log('Unknown button clicked');
            break;
        }
      });
    });
  }
  
  //
  renderLevelSelectionMenu() {
    const clearedLevels = this.viewModel.getClearedLevels();
    const totalLevels = Map.getTotalLevels();

    let menuContent = ` <div id="startMenu">
                         <div class="glowingRGB">
                            <span></span>
                            <span></span>
                            <div class="display">
                                <div id="menuTitle">SELECT LEVEL</div>
                            </div>
                        </div>
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
    }, "100");
  }
}

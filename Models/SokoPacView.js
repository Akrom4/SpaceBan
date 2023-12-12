/**
 * View class for the SokoPac game
 * Handles the user interface rendering
 */
class SokoPacView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.keyEvent = this.keyEvent.bind(this);
    this.bindButtonEvents = this.bindButtonEvents.bind(this);
    this.gridInitialized = false;
  }

  // Initialize the grid
  initUI() {
    this.renderUI("app", this.userInterface());
    this.gridInitialized = true;
    this.bindButtonEvents();
    this.bindEvents();
  }

  // Add the gameMenu and the gameGrid divs
  userInterface() {
    let content = `
      <div id="gameContainer" class="game-container">
        <div id="gameGrid" class="game-grid"></div>
        <div id="actions" class="actions">
          <div class="nav">
            ${this.createUIButton({ id: "levels", text: "Collections" })}
            ${this.createUIButton({ id: "collections", text: "Levels" })}
          </div>
          <div class="boardActions">
            ${this.createUIButton({ id: "undo", text: "Undo" })}
            ${this.createUIButton({ id: "reset", text: "Reset" })}
          </div>
        </div>
      </div>
    `;
    return content;
  }

  // Create a button
  createUIButton({ id, text }) {
    return `
      <div class="square3-container">
        <button id="${id}" class="button">
          <span></span><span></span>
          <div class="button-display">
            <div class="button-content">${text}</div>
          </div>
        </button>
      </div>`;
  }

  // Handle keyboard and buttons events
  bindEvents() {
    const app = document.getElementById("app");

    // Remove existing event listeners
    app.removeEventListener("click", this.handleButtonClick);
    window.removeEventListener("keydown", this.keyEvent);

    // Add event listeners
    app.addEventListener("click", this.handleButtonClick);
    window.addEventListener("keydown", this.keyEvent);
  }

  // Remove keyboard event listeners
  removeKeyEvents() {
    window.removeEventListener("keydown", this.keyEvent);
  }

  // Handle button clicks
  bindButtonEvents() {
    const levelsButton = document.getElementById("levels");
    const collectionsButton = document.getElementById("collections");
    const undoButton = document.getElementById("undo");
    const resetButton = document.getElementById("reset");

    levelsButton.addEventListener("click", () => {
      // Handle the 'Collections'
      this.renderStartMenu();
    });

    collectionsButton.addEventListener("click", () => {
      // Handle the 'Levels'
      this.renderLevelSelectionMenu();
    });

    undoButton.addEventListener("click", () => {
      this.viewModel.handleUndo();
    });

    resetButton.addEventListener("click", () => {
      this.viewModel.handleReset();
    });
  }

  // Handle keyboard events, tries to move the robot
  keyEvent(event) {
    const moveMap = { "ArrowLeft": [-1, 0], "ArrowRight": [1, 0], "ArrowUp": [0, -1], "ArrowDown": [0, 1] };
    if (moveMap[event.key]) this.viewModel.handleMove(moveMap[event.key]);
  }

  // Render a part of the UI
  renderUI(targetId, content) {
    document.getElementById(targetId).innerHTML = content;
  }

  // Update the game UI
  updateUI() {
    if (!this.gridInitialized) {
      this.initializeGrid();
    }
    const boardDiv = document.getElementById("gameGrid");
    const moveCountDiv = document.getElementById("moveCount");
    if (moveCountDiv) {
      moveCountDiv.textContent = "Moves: " + this.viewModel.model.moveCount;
    }

    // Calculate the number of columns and rows
    const numColumns = this.viewModel.model.squares[0].length;
    const numRows = this.viewModel.model.squares.length;

    // Determine whether the board is longer in horizontal or vertical orientation
    const isHorizontal = numColumns >= numRows;

    // Calculate squareSize based on the longer dimension
    const maxDimension = isHorizontal ? numColumns : numRows;
    const squareSize = Math.min(90 / maxDimension, 7); // Calculate size, but not larger than 5vmin

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

        if (square === 0) { // Robot
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square0" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/robot.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                </div>
                            </div>`;
        } else if (square === 6) { // Robot on dot
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square0" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/robot.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                    <div class="square square1" style="width: ${squareSize * 0.3}vmin; height: ${squareSize * 0.3}vmin; z-index: 1; position: absolute;"></div>
                                </div>
                            </div>`;
        } else if (square === 2) { // Alien
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square2" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/alienWin.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                </div>
                            </div>`;
        } else if (square === 5) { // Alien on dot
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square5" style="width: ${squareSize}vmin; height: ${squareSize}vmin; position: relative;">
                                    <img src="../Images/alien.png" style="width: 80%; height: 80%; position: absolute; z-index: 2;">
                                    <div class="square square1" style="width: ${squareSize * 0.3}vmin; height: ${squareSize * 0.3}vmin; z-index: 1; position: absolute;"></div>
                                </div>
                            </div>`;

        } else if (square === 3) { // Wall
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square${square}" style="width: ${adjustedSize}vmin; height: ${adjustedSize}vmin;">
                                    <span></span><span></span>
                                    <div class="square3-display">
                                        <div class="square3-content"></div>
                                    </div>
                                </div>
                            </div>`;
        } else { // Other squares
          content += `<div class="squareWrap" style="width: ${squareSize}vmin; height: ${squareSize}vmin;">
                                <div class="square square${square}" style="width: ${adjustedSize}vmin; height: ${adjustedSize}vmin;"></div>
                            </div>`;
        }
      });
    });
    return content;
  }

  // Render collections menu
  renderStartMenu() {
    const menuOptions = [
      { id: "Vanilla", text: "Original", description: "Play the Classic Sokoban maps" },
      { id: "AutoGen", text: "Auto Gen", description: "AI-assisted creations can be quite challenging!" },
      { id: "Handmade", text: "Yoshio", description: "Enjoy layouts created by Yoshio Murase" }
    ];

    let menuContent = `
      <div id="startMenu">
        <div class="glowingRGB">
          <span></span><span></span>
          <div class="display">
            <div id="menuTitle">SELECT COLLECTION</div>
          </div>
        </div>
        <div id="mapChoices" class="map-choice-container">
          ${menuOptions.map(option => this.createMenuButton(option)).join('')}
        </div>
      </div>`;

    this.renderUI("app", menuContent);
    this.bindStartMenuEvents();
  }

  // Create a collection and the assiociated button
  createMenuButton({ id, text, description }) {
    return `
      <div class="button-container">
        <button id="${id}" class="menu-button button map-choice">
          <span></span><span></span>
          <div class="button-display">
            <div class="button-content">${text}</div>
          </div>
        </button>
        <p class="button-description">${description}</p>
      </div>`;
  }

  // Bind events for the collection menu
  bindStartMenuEvents() {
    const buttons = document.querySelectorAll(".menu-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        switch (event.currentTarget.id) {
          case 'createMapButton':
            console.log('Create Map button clicked');
            break;
          case 'Vanilla':
          case 'AutoGen':
          case 'Handmade':
            // Call the ViewModel function to handle collection selection
            this.viewModel.handleCollectionSelection(event.currentTarget.id);
            break;
          default:
            // Optional: Handle any other case or log an error
            console.log('Unknown button clicked');
            break;
        }
      });
    });
  }

  // Render level selection menu
  renderLevelSelectionMenu() {
    const collectionId = this.viewModel.model.mapCollection.collectionId;
    const progress = this.viewModel.getClearedLevels();
    const clearedLevels = progress[collectionId] || [];
    console.log("Cleared levels for collection", collectionId, ":", clearedLevels);

    const totalLevels = this.viewModel.model.mapCollection.getTotalLevels();
// &#8592;
    let menuContent = `<div id="startMenu">
                        <div class="title-container">
                            <div class="back-container">
                            <button id="backToCollections" class="button">
                              <span></span><span></span>
                              <div class="button-display">
                                <div class="button-back"></div>
                              </div>
                            </button>
                          </div>
                          <div class="glowingRGB">
                            <span></span><span></span>
                            <div class="display">
                              <div id="menuTitle">SELECT LEVEL</div>
                            </div>
                          </div>
                        </div>
                        <div id="levelSelection">`;

    for (let level = 1; level <= totalLevels; level++) {
      const isCleared = clearedLevels.includes(level.toString());
      console.log("Level", level, "is cleared:", isCleared);
      menuContent += `<div class="square3-container">
                        <button class="level-btn button" data-level="${level}">
                          <span></span><span></span>
                          <div class="button-display ${isCleared ? "button-win" : ""}">
                            <div class="button-content">${level.toString().padStart(2, '0')}</div>
                          </div>
                        </button>
                      </div>`;
    }

    menuContent += `</div></div>`;
    document.getElementById("app").innerHTML = menuContent;
    this.bindLevelSelectionEvents();
  }


  // Bind events for the level selection menu
  bindLevelSelectionEvents() {
    const levelButtons = document.querySelectorAll(".level-btn");
    levelButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const selectedLevel = event.currentTarget.dataset.level;
        this.viewModel.handleLevelSelection(selectedLevel);
      });
    });

    const backToCollectionsBtn = document.getElementById("backToCollections");
    if (backToCollectionsBtn) {
      backToCollectionsBtn.addEventListener("click", () => {
        this.renderStartMenu();
      });
    }
  }

  // Show the win modal
  showWinModal() {
    const modalContent = `
      <div id="winModal" class="modal">
        <div class="modal-content">
          <div class="modal-display">
            <div class="modalRGB">
              <div id="lvlCleared">LEVEL CLEARED !</div>
              <div class="modal-options">              
                <button id="collectionSelectionButton">Back to Collections</button>
                <button id="levelSelectionButton">Back to Levels</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add the modal content to the app element
    const app = document.getElementById("app");
    app.insertAdjacentHTML("beforeend", modalContent);

    // Bind click events for modal buttons
    const levelSelectionButton = document.getElementById("levelSelectionButton");
    const collectionSelectionButton = document.getElementById("collectionSelectionButton");


    levelSelectionButton.addEventListener("click", () => {
      // Handle going back to level selection
      this.renderLevelSelectionMenu();
      this.closeWinModal();
    });

    collectionSelectionButton.addEventListener("click", () => {
      // Handle going back to collection selection
      this.renderStartMenu();
      this.closeWinModal();
    });
  }

  closeWinModal() {
    const winModal = document.getElementById("winModal");
    if (winModal) {
      winModal.remove();
    }
  }
}

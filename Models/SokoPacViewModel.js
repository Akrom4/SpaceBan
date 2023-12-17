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

  // Load maps from a collection
  async loadMapsFromCollection(collectionId) {
    const mapCollection = new MapCollection(collectionId);
    await mapCollection.loadMaps(collectionId);
    return mapCollection;
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
      this.view.showWinModal();
      this.saveLevelProgress(this.model.level);
    }
  }

  // Save the level progress to local storage
  saveLevelProgress(level) {
    console.log("Saving level progress");
    const collectionId = this.model.mapCollection.collectionId;
    console.log("Collection ID:", collectionId);
    let progress = this.getClearedLevels();
    console.log("Progress:", progress);
    // Initialize progress for the collection if not already done
    if (!progress[collectionId]) {
      progress[collectionId] = [];
    }
    // Add level to cleared levels if not already included
    if (!progress[collectionId].includes(level)) {
      progress[collectionId].push(level);
      localStorage.setItem("sokoPacClearedLevels", JSON.stringify(progress));
    }
  }

  // Retrieve cleared levels from local storage
  getClearedLevels() {
    let progress = localStorage.getItem("sokoPacClearedLevels");
    console.log("Retrieved progress:", progress);
    return progress ? JSON.parse(progress) : {};
  }

  // Bind the View to the ViewModel
  setView(view) {
    this.view = view;
  }

  // Handle the collection selection
  async handleCollectionSelection(collection) {
    // Load maps for the selected collection
    const mapCollection = await this.loadMapsFromCollection(collection);
    this.model.setMapCollection(mapCollection);

    // Continue with rendering the level selection menu or other actions
    this.view.renderLevelSelectionMenu();
  }

  // Handle the level selection
  handleLevelSelection(level) {
    if (level) {
      this.model.loadLevel(level);
      this.view.initUI();
      this.view.updateUI();
    } else {
      console.error("Level data not found for level:", level);
    }
  }

  // Move handling
  handleMove(direction) {
    this.model.move(direction);
    this.view.updateUI();
  }

  // Restart the game to it's initial state
  handleReset() {
    this.model.resetBoard();
    this.view.initUI();
    this.view.updateUI();
  }

  // Handle the menu button
  handleMenu() {
    this.view.renderLevelSelectionMenu();
  }

  // Handle the undo button
  handleUndo() {
    this.model.undoMove();
    this.view.updateUI();
  }

  // Return the current level
  getCollectionId() {
    return this.model.mapCollection.collectionId;
  }

  // Return the total number of levels in the current collection
  getTotalLevels() {
    return this.model.mapCollection.getTotalLevels();
  }

  // Return the array of cleared levels for the current collection
  isLevelCleared(level) {
    const clearedLevels = this.getClearedLevels()[this.getCollectionId()] || [];
    return clearedLevels.includes(level);
  }

  // Return the move count
  getMoveCount() {
    return this.model.moveCount;
  }
  // Return the board dimensions
  getBoardDimensions() {
    const numColumns = this.model.squares[0].length;
    const numRows = this.model.squares.length;
    return { numColumns, numRows };
  }

  getSquares() {
    return this.model.squares;
  }
}

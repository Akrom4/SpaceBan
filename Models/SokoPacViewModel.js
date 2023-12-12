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

  //
  saveLevelProgress(level) {
    let clearedLevels = this.getClearedLevels();
    if (!clearedLevels.includes(level)) {
      clearedLevels.push(level);
      localStorage.setItem(
        "sokoPacClearedLevels",
        JSON.stringify(clearedLevels)
      );
    }
  }

  // Retrieve cleared levels from local storage
  getClearedLevels() {
    let clearedLevels = localStorage.getItem("sokoPacClearedLevels");
    return clearedLevels ? JSON.parse(clearedLevels) : [];
  }

  // Bind the View to the ViewModel
  setView(view) {
    this.view = view;
  }

  async handleCollectionSelection(collection) {
    console.log(collection);


    // Load maps for the selected collection
    const mapCollection = await this.loadMapsFromCollection(collection);
    this.model.setMapCollection(mapCollection); // Assume this method sets the map collection in the model

    // Continue with rendering the level selection menu or other actions
    this.view.renderLevelSelectionMenu();
  }
  //
  handleLevelSelection(level) {
    if (level) {
      this.model.loadLevel(level); // Load the selected level
      this.view.initUI(); // Initialize the UI for the selected level
      this.view.updateUI();
    } else {
      console.error("Level data not found for level:", level);
      // Additional handling for this error situation
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
  //
  handleMenu() {
    this.view.renderLevelSelectionMenu();
  }
  //
  handleUndo() {
    this.model.undoMove();
    this.view.updateUI();
  }
}

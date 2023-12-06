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

  //
  handleLevelSelection(level) {
    this.model.loadLevel(level); // Load the selected level
    this.view.initUI(); // Initialize the UI for the selected level
    this.view.updateUI();
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


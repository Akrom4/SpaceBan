class MapCollection {
    constructor(collectionId) {
      this.collectionId = collectionId;
      this.levels = [];
      this.loadMaps(collectionId).then(data => {
        this.levels = data;
      });
    }
  
    async loadMaps(collectionId) {
      try {
        const response = await fetch(`Maps/${collectionId}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Failed to load maps:", error);
        return [];
      }
    }
  
    getLevel(levelNumber) {
        // If levelNumber is not a string, convert it to string
        const levelKey = String(levelNumber);
        if (this.levels[levelKey]) {
          return JSON.parse(JSON.stringify(this.levels[levelKey]));
        } else {
          console.error("Level key not found in map collection:", levelKey);
          return null;
        }
      }
      
  
    getTotalLevels() {
      return Object.keys(this.levels).length;
    }
  }
  
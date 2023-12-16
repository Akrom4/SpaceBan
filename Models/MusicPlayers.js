class MusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentSongIndex = -1;
        this.playlist = [];
    }

    playIndex(index) {
        if (index < 0 || index >= this.playlist.length) {
            console.log("Invalid song index.");
            return;
        }

        this.currentSongIndex = index;
        this.isPlaying = true;
        console.log(`Playing: ${this.playlist[this.currentSongIndex].title}`);
        // Integrate with actual audio playback here
    }

    pause() {
        if (!this.isPlaying) {
            console.log("Music is already paused.");
            return;
        }

        this.isPlaying = false;
        console.log("Music paused.");
        // Integrate with actual audio pausing here
    }

    stop() {
        if (!this.isPlaying) {
            console.log("Music is already stopped.");
            return;
        }

        this.isPlaying = false;
        console.log("Music stopped.");
        // Integrate with actual audio stopping here
    }

    nextSong() {
        if (this.playlist.length === 0) {
            console.log("Playlist is empty.");
            return;
        }

        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.playIndex(this.currentSongIndex);
    }

    previousSong() {
        if (this.playlist.length === 0) {
            console.log("Playlist is empty.");
            return;
        }

        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playIndex(this.currentSongIndex);
    }

    addToPlaylist(song) {
        this.playlist.push(song);
        console.log(`Added ${song.title} to the playlist.`);
    }

    getCurrentSong() {
        return this.playlist.length ? this.playlist[this.currentSongIndex] : null;
    }
}

// Example usage
const musicPlayer = new MusicPlayer();
musicPlayer.addToPlaylist({ title: "Song 1", artist: "Artist 1", url: "song1.mp3" });
musicPlayer.addToPlaylist({ title: "Song 2", artist: "Artist 2", url: "song2.mp3" });
musicPlayer.playIndex(0);

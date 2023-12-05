class Pac
{
    constructor(position = null){
        this.position = position;
    }

    setPosition(position){
        this.position  = position;
    }
    getPosition(){
        return this.position;
    }
    getPositionRow(){
        return this.position[0];
    }
    getPositionColumn(){
        return this.position[1];
    }
}
class Dots
{
    constructor(){
        this.dots = [];
    }

    add(coord){
        this.dots.push(coord);
    }

    toConsole(){
        console.log(this.dots);
    }
}
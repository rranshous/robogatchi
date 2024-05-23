class PositionIterator {
    width: number
    height: number

    constructor(width: number, height: number) { 
        this.width = width;
        this.height = height;
    }

    eachPos(callback: Function) {
        for(let x=0; x<this.width; x++) {
            for(let y=0; y<this.height; y++) {
                callback(x, y);
            }
        }
    }
}

class Mask {
    pixels: Array<boolean>
    width: number
    height: number

    constructor(width: number, height: number) {
        this.pixels = new Array<boolean>;
        this.width = width;
        this.height = height;
        this.initializePixels();
    }

    initializePixels() {
        new PositionIterator(this.width, this.height).eachPos((x: number, y: number) => {
            this.setPixel(x, y, false);
        })
    }

    getPixel(x: number, y: number) {
        return this.pixels[this.calcPos(x, y)];
    }

    setPixel(x: number, y: number, val=true) {
        this.pixels[this.calcPos(x, y)] = val;
    }

    clearPixel(x: number, y: number) {
        this.setPixel(x, y, false); 
    }

    togglePixel(x: number, y: number) {
        this.setPixel(x, y, !this.getPixel(x, y));
    }

    calcPos(x: number, y: number) {
        return y * this.width + x;
    }
}

class App {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    imageData: ImageData
    mask: Mask

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("stagesVisualEditor");
        if(!this.canvas) { throw "canvas not found"; }
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.canvas.addEventListener("click", (event) => this.handleClick(event));
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.mask = new Mask(this.canvas.width, this.canvas.height);
        this.redraw();
    }

    handleClick(event: MouseEvent) : void {
        const cursorPos = this.getTransformedPoint(event.offsetX, event.offsetY);
        console.log("setPixel", { x: cursorPos.x, y: cursorPos.y });
        this.mask.togglePixel(cursorPos.x, cursorPos.y);
        this.redraw();
    }

    redraw() {
        new PositionIterator(this.canvas.width, this.canvas.height).eachPos((x: number, y: number) => {
            if(this.mask.getPixel(x, y)) {
                this.setPixel(x, y, 0, 153, 0, 100);
            } else {
                this.setPixel(x, y, 255, 255, 255, 100);
            }
        });
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    setPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        const index = x + y * this.imageData.width;
        this.imageData.data[index * 4] = r;
        this.imageData.data[index * 4 + 1] = g;
        this.imageData.data[index * 4 + 2] = b;
        this.imageData.data[index * 4 + 3] = a;
    }

    getTransformedPoint(x: number, y: number) {
        const originalPoint = new DOMPoint(x, y);
        const transformedPoint = this.ctx.getTransform().invertSelf().transformPoint(originalPoint);
        const dimensions = this.canvas.getClientRects()[0];
        const nx = (this.canvas.width / dimensions.width) * transformedPoint.x;
        const ny = (this.canvas.height / dimensions.height) * transformedPoint.y;
        return new DOMPoint(Math.floor(nx), Math.floor(ny));
    }


};

new App();
console.log("loaded");
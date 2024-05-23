class App {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    imageData: ImageData

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("stagesVisualEditor");
        if(!this.canvas) { throw "canvas not found"; }
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        this.canvas.addEventListener("click", (event) => this.handleClick(event));
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }

    handleClick(event: MouseEvent) : void {
        const cursorPos = this.getTransformedPoint(event.offsetX, event.offsetY);
        console.log("setPixel", { x: cursorPos.x, y: cursorPos.y })
        this.setPixel(cursorPos.x, cursorPos.y, 0, 153, 0, 100);
    }

    setPixel(x: number, y: number, r: number, g: number, b: number, a: number) {
        const index = x + y * this.imageData.width;
        this.imageData.data[index * 4] = r;
        this.imageData.data[index * 4 + 1] = g;
        this.imageData.data[index * 4 + 2] = b;
        this.imageData.data[index * 4 + 3] = a;
        this.ctx.putImageData(this.imageData, 0, 0);
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
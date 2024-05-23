"use strict";
class PositionIterator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    eachPos(callback) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                callback(x, y);
            }
        }
    }
}
class MonoImage {
    constructor(width, height) {
        this.pixels = new Array;
        this.width = width;
        this.height = height;
    }
    initializePixels() {
        new PositionIterator(this.width, this.height).eachPos((x, y) => {
            this.setPixel(x, y);
        });
    }
    getPixel(x, y) {
        return this.pixels[this.calcPos(x, y)];
    }
    setPixel(x, y, val = true) {
        this.pixels[this.calcPos(x, y)] = true;
    }
    clearPixel(x, y) {
        this.setPixel(x, y, false);
    }
    togglePixel(x, y) {
        this.setPixel(x, y, !this.getPixel(x, y));
    }
    calcPos(x, y) {
        return y * this.width + x;
    }
}
class App {
    constructor() {
        this.canvas = document.getElementById("stagesVisualEditor");
        if (!this.canvas) {
            throw "canvas not found";
        }
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", (event) => this.handleClick(event));
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.image = new MonoImage(this.canvas.width, this.canvas.height);
    }
    handleClick(event) {
        const cursorPos = this.getTransformedPoint(event.offsetX, event.offsetY);
        console.log("setPixel", { x: cursorPos.x, y: cursorPos.y });
        this.image.togglePixel(cursorPos.x, cursorPos.y);
        this.redraw();
    }
    redraw() {
        new PositionIterator(this.canvas.width, this.canvas.height).eachPos((x, y) => {
            if (this.image.getPixel(x, y)) {
                this.setPixel(x, y, 0, 153, 0, 100);
            }
            else {
                this.setPixel(x, y, 255, 255, 255, 100);
            }
        });
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    setPixel(x, y, r, g, b, a) {
        const index = x + y * this.imageData.width;
        this.imageData.data[index * 4] = r;
        this.imageData.data[index * 4 + 1] = g;
        this.imageData.data[index * 4 + 2] = b;
        this.imageData.data[index * 4 + 3] = a;
    }
    getTransformedPoint(x, y) {
        const originalPoint = new DOMPoint(x, y);
        const transformedPoint = this.ctx.getTransform().invertSelf().transformPoint(originalPoint);
        const dimensions = this.canvas.getClientRects()[0];
        const nx = (this.canvas.width / dimensions.width) * transformedPoint.x;
        const ny = (this.canvas.height / dimensions.height) * transformedPoint.y;
        return new DOMPoint(Math.floor(nx), Math.floor(ny));
    }
}
;
new App();
console.log("loaded");

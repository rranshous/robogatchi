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
class Mask {
    constructor(width, height) {
        this.pixels = new Array;
        this.width = width;
        this.height = height;
        this.initializePixels();
    }
    initializePixels() {
        new PositionIterator(this.width, this.height).eachPos((x, y) => {
            this.setPixel(x, y, false);
        });
    }
    getPixel(x, y) {
        return this.pixels[this.calcPos(x, y)];
    }
    setPixel(x, y, val = true) {
        this.pixels[this.calcPos(x, y)] = val;
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
class Sprite {
    constructor(width, height) {
        this.palette = {
            primaryColor: { r: 122, g: 150, b: 8, a: 255 },
            secondaryColor: { r: 7, g: 15, b: 43, a: 255 }
        };
        this.mask = new Mask(width, height);
    }
    getPixel(x, y) {
        return this.mask.getPixel(x, y) ? this.palette.primaryColor : this.palette.secondaryColor;
    }
    togglePixel(x, y) {
        this.mask.togglePixel(x, y);
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
        this.mask = new Mask(this.canvas.width, this.canvas.height);
        this.sprite = new Sprite(this.canvas.width, this.canvas.height);
        this.redraw();
    }
    handleClick(event) {
        const cursorPos = this.getTransformedPoint(event.offsetX, event.offsetY);
        console.log("setPixel", { x: cursorPos.x, y: cursorPos.y });
        this.sprite.togglePixel(cursorPos.x, cursorPos.y);
        this.redraw();
    }
    redraw() {
        new PositionIterator(this.canvas.width, this.canvas.height).eachPos((x, y) => {
            const rgba = this.sprite.getPixel(x, y);
            this.setPixel(x, y, rgba.r, rgba.g, rgba.b, rgba.a);
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

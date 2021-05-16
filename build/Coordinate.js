var GJKTutorial;
(function (GJKTutorial) {
    class Coordinate {
        constructor(inCanvas) {
            this.coordXMax = 8.5;
            this.coordYMax = 8.5;
            this.canvas = inCanvas;
        }
        get canvasWidth() {
            return this.canvas.height;
        }
        get canvasHeight() {
            return this.canvas.height;
        }
        GetCanvasPosByCoord(coord) {
            return new GJKTutorial.Vec2(this.canvasWidth / 2 * coord.x / this.coordXMax + this.canvasWidth / 2, this.canvasHeight / 2 - this.canvasHeight / 2 * coord.y / this.coordYMax);
        }
        GetCoordByCanvasPos(pos) {
            return new GJKTutorial.Vec2(pos.x / this.canvasWidth * this.coordXMax * 2 - this.coordXMax, this.coordYMax - pos.y / this.canvasHeight * this.coordYMax * 2);
        }
        Draw(context) {
            //Draw X and Y Axis
            context.beginPath();
            let coordXMin_Pos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(-this.coordXMax, 0));
            let coordXMan_Pos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(this.coordXMax, 0));
            let coordYMin_Pos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, -this.coordYMax));
            let coordYMax_Pos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, this.coordYMax));
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.moveTo(coordXMin_Pos.x, coordXMin_Pos.y);
            context.lineTo(coordXMan_Pos.x, coordXMan_Pos.y);
            context.moveTo(coordYMin_Pos.x, coordYMin_Pos.y);
            context.lineTo(coordYMax_Pos.x, coordYMax_Pos.y);
            context.stroke();
            context.closePath();
            //Draw Coord Grids
            context.lineWidth = 0.5;
            context.setLineDash([3, 6]);
            context.strokeStyle = "#00ff00";
            context.beginPath();
            let xInt = Math.floor(this.coordXMax);
            let yInt = Math.floor(this.coordYMax);
            for (let x = -xInt; x <= xInt; ++x) {
                if (x == 0) {
                    continue;
                }
                let minPos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(x, -this.coordYMax));
                let maxPos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(x, this.coordYMax));
                context.moveTo(minPos.x, minPos.y);
                context.lineTo(maxPos.x, maxPos.y);
            }
            for (let y = -yInt; y <= yInt; ++y) {
                if (y == 0) {
                    continue;
                }
                let minPos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(-this.coordXMax, y));
                let maxPos = this.GetCanvasPosByCoord(new GJKTutorial.Vec2(this.coordXMax, y));
                context.moveTo(minPos.x, minPos.y);
                context.lineTo(maxPos.x, maxPos.y);
            }
            context.stroke();
            context.closePath();
            context.setLineDash([]);
        }
    }
    GJKTutorial.Coordinate = Coordinate;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Coordinate.js.map
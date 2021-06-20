var GJKTutorial;
(function (GJKTutorial) {
    class Circle extends GJKTutorial.Convex {
        constructor(centerPos, radius) {
            super();
            this.pos = new GJKTutorial.Vec2(0, 0);
            this.radius = 1;
            this.pos = centerPos;
            this.radius = radius;
        }
        Translate(offset) {
            this.pos = this.pos.Add(offset);
        }
        IsPointInConvex(point) {
            return point.Sub(this.pos).magnitudeSqr <= this.radius * this.radius;
        }
        GetCenterCoord() {
            return this.pos;
        }
        Support(dir) {
            return new GJKTutorial.Vertex(this.pos.Add(dir.Normalize().Mul(this.radius)), this.name);
        }
        Draw(deltaMs, coord, context, strokeColor, fillColor) {
            let centerPos = coord.GetCanvasPosByCoord(this.pos);
            let radius = coord.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, this.radius)).Sub(coord.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, 0))).magnitude;
            context.beginPath();
            context.arc(centerPos.x, centerPos.y, 4, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            context.closePath();
            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = strokeColor;
            context.arc(centerPos.x, centerPos.y, radius, 0, 2 * Math.PI, false);
            context.stroke();
            context.closePath();
            context.fillStyle = fillColor;
            context.fill();
            if (this.drawName && this.name) {
                context.fillStyle = 'black';
                context.font = "40px Arial";
                context.fillText(this.name, centerPos.x, centerPos.y);
            }
        }
    }
    GJKTutorial.Circle = Circle;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Circle.js.map
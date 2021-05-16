var GJKTutorial;
(function (GJKTutorial) {
    class Vertex {
        constructor(inCoord, inName) {
            this.drawName = true; //toggle for name display;
            this.coord = new GJKTutorial.Vec2(inCoord.x, inCoord.y);
            this.name = inName;
        }
        static numToString(num, accuracy) {
            let mul = Math.pow(10, accuracy);
            num = num * mul;
            num = Math.round(num);
            num = num / mul;
            return num + "";
        }
        Draw(coord, context) {
            if (!this.drawName) {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.font = "30px Arial";
            context.fillStyle = "#000000FF";
            context.fillText(this.name + "(" + Vertex.numToString(this.coord.x, 2) + "," + Vertex.numToString(this.coord.y, 2) + ")", pos.x, pos.y);
        }
    }
    GJKTutorial.Vertex = Vertex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Vertex.js.map
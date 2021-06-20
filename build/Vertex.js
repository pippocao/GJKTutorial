var GJKTutorial;
(function (GJKTutorial) {
    class Vertex {
        constructor(inCoord, inName) {
            this.drawName = true; //toggle for name display;
            this.coord = inCoord.Clone();
            this.name = inName;
        }
        get name() {
            return this._name;
        }
        set name(inName) {
            this._name = inName ? inName.toLowerCase() : inName;
        }
        Draw(deltaMs, coord, context) {
            if (!this.drawName) {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.font = "30px Arial";
            context.fillStyle = "#000000FF";
            context.fillText(this.name + "(" + GJKTutorial.numToString(this.coord.x, 2) + "," + GJKTutorial.numToString(this.coord.y, 2) + ")", pos.x, pos.y);
        }
    }
    GJKTutorial.Vertex = Vertex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Vertex.js.map
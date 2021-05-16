var GJKTutorial;
(function (GJKTutorial) {
    class Vertex {
        constructor(inCoord, inName) {
            this.drawName = true; //toggle for name display;
            this.coord = new GJKTutorial.Vec2(inCoord.x, inCoord.y);
            this.name = inName;
        }
        Draw(coord, context) {
            if (!this.drawName) {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.strokeText(this.name, pos.x, pos.y);
        }
    }
    GJKTutorial.Vertex = Vertex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Vertex.js.map
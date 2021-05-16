var GJKTutorial;
(function (GJKTutorial) {
    class Convex {
        constructor() {
            this.vertices = [];
            this.drawName = true; //toggle for name display;
        }
        AddVertex(vertex) {
            this.vertices.push(vertex);
        }
        RemoveVertex(index) {
            this.vertices.splice(index, 1);
        }
        GetVertices() {
            return this.vertices;
        }
        IsConvex() {
            //todo
            return true;
        }
        Draw(coord, context) {
            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = 'black';
            for (let i = 0; i < this.vertices.length; ++i) {
                let pos = coord.GetCanvasPosByCoord(this.vertices[i].coord);
                if (i == 0) {
                    context.moveTo(pos.x, pos.y);
                }
                else {
                    context.lineTo(pos.x, pos.y);
                }
                this.vertices[i].Draw(coord, context);
                if (this.drawName) {
                    //context.fillText(this.name, pos.x, pos.y);
                }
            }
            context.stroke();
            context.closePath();
            context.fill();
        }
    }
    GJKTutorial.Convex = Convex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Convex.js.map
var GJKTutorial;
(function (GJKTutorial) {
    class Main {
        constructor() {
            this.convexObjs = [];
            this.convexCounter = 0;
            this.convexFillColors = ['#8e232244', '#2387ff44'];
            this.canvas = document.getElementById('canvas');
            this.context = this.canvas.getContext("2d");
            this.coord = new GJKTutorial.Coordinate(this.canvas);
        }
        update() {
            this.ClearCanvas();
            this.DrawCoordinate();
            this.DrawConvexObjs();
        }
        ClearCanvas() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        DrawCoordinate() {
            this.coord.Draw(this.context);
        }
        DrawConvexObjs() {
            for (let i = 0; i < this.convexObjs.length; ++i) {
                this.convexObjs[i].Draw(this.coord, this.context);
            }
        }
        AddConvex(convex) {
            this.convexObjs.push(convex);
            convex.fillColor = this.convexFillColors[this.convexCounter % this.convexFillColors.length];
            ++this.convexCounter;
        }
        RemoveConvex(convex) {
            if (convex instanceof GJKTutorial.Convex) {
                let index = this.convexObjs.indexOf(convex);
                if (index >= 0) {
                    this.convexObjs.splice(index, 1);
                }
            }
            else {
                this.convexObjs.splice(convex, 1);
            }
        }
    }
    window.onload = function () {
        let main = new Main();
        let conv = new GJKTutorial.Convex();
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(3, 4), "a"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(5, 2), "b"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-5, -4), "c"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-8, -2), "d"));
        conv.name = "A";
        main.AddConvex(conv);
        conv = new GJKTutorial.Convex();
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(6, 4), "e"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(2, 2), "f"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-5, -4), "g"));
        conv.name = "B";
        main.AddConvex(conv);
        console.log(conv.IsConvex());
        setInterval(() => { main.update(); }, 16);
    };
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=main.js.map
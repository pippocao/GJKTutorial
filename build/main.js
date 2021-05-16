var GJKTutorial;
(function (GJKTutorial) {
    class Framework {
        constructor(inCanvas) {
            this.convexObjs = [];
            this.convexCounter = 0;
            this.convexFillColors = ['#8e232244', '#2387ff44'];
            this.customDrawBeforeDrawConvex = null;
            this.customDrawAfterDrawConvex = null;
            this.canvas = inCanvas;
            this.context = this.canvas.getContext("2d");
            this.coord = new GJKTutorial.Coordinate(this.canvas);
            setInterval(() => { this.update(); }, 16);
        }
        update() {
            this.ClearCanvas();
            this.DrawCoordinate();
            if (this.customDrawBeforeDrawConvex) {
                this.customDrawBeforeDrawConvex(this.coord, this.context);
            }
            this.DrawConvexObjs();
            if (this.customDrawAfterDrawConvex) {
                this.customDrawAfterDrawConvex(this.coord, this.context);
            }
        }
        SetCustomDrawFunctionBeforeDrawConvex(func) {
            this.customDrawBeforeDrawConvex = func;
        }
        SetCustomDrawFunctionAfterDrawConvex(func) {
            this.customDrawAfterDrawConvex = func;
        }
        GetCoordinate() {
            return this.coord;
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
        GetConvexObjsCount() {
            return this.convexObjs.length;
        }
        GetConvex(index) {
            return this.convexObjs[index];
        }
        //the maximum number of convex objects is 2;
        AddConvex(convex) {
            this.convexObjs.push(convex);
            convex.fillColor = this.convexFillColors[this.convexCounter % this.convexFillColors.length];
            ++this.convexCounter;
            if (this.convexObjs.length > 2) {
                this.convexObjs.splice(0, 1);
            }
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
    GJKTutorial.Framework = Framework;
    window.onload = function () {
        let canvas = document.getElementById('canvas');
        let framework = new Framework(canvas);
        let conv = new GJKTutorial.Convex();
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(3, 4), "a"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(5, 2), "b"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-5, -4), "c"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-8, -2), "d"));
        conv.name = "A";
        framework.AddConvex(conv);
        conv = new GJKTutorial.Convex();
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(6, 4), "e"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(2, 2), "f"));
        conv.AddVertex(new GJKTutorial.Vertex(new GJKTutorial.Vec2(-5, -4), "g"));
        conv.name = "B";
        framework.AddConvex(conv);
        let buttonClear = document.getElementById('ClearAllConvex');
        let buttonBeginAdd = document.getElementById('BeginAddNewConvex');
        let buttonFinishAdd = document.getElementById('FinishAddNewConvex');
        let buttonCancel = document.getElementById('CancelAddNewConvex');
        GJKTutorial.InitDrawCustomConvex(framework, canvas, buttonClear, buttonBeginAdd, buttonFinishAdd, buttonCancel);
    };
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=main.js.map
var GJKTutorial;
(function (GJKTutorial) {
    class Framework {
        constructor(inCanvas) {
            this.convexObjs = [];
            this.convexCounter = 0;
            this.convexFillColors = ['#8e232244', '#2387ff44'];
            this.customDrawsBeforeDrawConvex = [];
            this.customDrawsAfterDrawConvex = [];
            this.customDrawsFinal = [];
            this.leftMouseDown = null;
            this.leftMouseMove = null;
            this.leftMouseUp = null;
            this.canvas = inCanvas;
            this.context = this.canvas.getContext("2d");
            this.coord = new GJKTutorial.Coordinate(this.canvas);
            let lastUpdateTime = Date.now();
            setInterval(() => {
                let currentTime = Date.now();
                this.update(currentTime - lastUpdateTime);
                lastUpdateTime = currentTime;
            }, 16);
            let isLeftMouseDown = false;
            this.canvas.addEventListener('mousedown', (evt) => {
                if (this.leftMouseDown && evt.button == 0) {
                    isLeftMouseDown = true;
                    this.leftMouseDown(evt);
                }
            });
            this.canvas.addEventListener('mouseup', (evt) => {
                if (this.leftMouseUp && evt.button == 0) {
                    isLeftMouseDown = false;
                    this.leftMouseUp(evt);
                }
            });
            this.canvas.addEventListener('mousemove', (evt) => {
                if (this.leftMouseMove && isLeftMouseDown) {
                    this.leftMouseMove(evt);
                }
            });
        }
        update(deltaMs) {
            this.ClearCanvas();
            this.DrawCoordinate(deltaMs);
            this.customDrawsBeforeDrawConvex.forEach(element => {
                element(deltaMs, this.coord, this.context);
            });
            this.DrawConvexObjs(deltaMs);
            this.customDrawsAfterDrawConvex.forEach(element => {
                element(deltaMs, this.coord, this.context);
            });
            this.customDrawsFinal.forEach(element => {
                element(deltaMs, this.coord, this.context);
            });
            if (this.convexObjs.length == 2) {
                if (GJKTutorial.GJKTest(this.convexObjs[0], this.convexObjs[1]) != null) {
                    this.context.fillRect(0, 0, 20, 20);
                }
            }
        }
        RegisterLeftMouseEvent(mouseDown, mouseMove, mouseUp) {
            this.leftMouseDown = mouseDown;
            this.leftMouseMove = mouseMove;
            this.leftMouseUp = mouseUp;
        }
        UnRegisterLeftMouseEvent(mouseDown, mouseMove, mouseUp) {
            if (this.leftMouseDown == mouseDown) {
                this.leftMouseDown = null;
            }
            if (this.leftMouseUp == mouseUp) {
                this.leftMouseUp = null;
            }
            if (this.leftMouseMove == mouseMove) {
                this.leftMouseMove = null;
            }
        }
        AddCustomDrawFunctionBeforeDrawConvex(func) {
            this.customDrawsBeforeDrawConvex.push(func);
        }
        RmvCustomDrawFunctionBeforeDrawConvex(func) {
            let index = this.customDrawsBeforeDrawConvex.indexOf(func);
            if (index >= 0) {
                this.customDrawsBeforeDrawConvex.splice(index, 1);
            }
        }
        AddCustomDrawFunctionAfterDrawConvex(func) {
            this.customDrawsAfterDrawConvex.push(func);
        }
        RmvCustomDrawFunctionAfterDrawConvex(func) {
            let index = this.customDrawsAfterDrawConvex.indexOf(func);
            if (index >= 0) {
                this.customDrawsAfterDrawConvex.splice(index, 1);
            }
        }
        AddCustomDrawFunctionFinal(func) {
            this.customDrawsFinal.push(func);
        }
        RmvCustomDrawFunctionFinal(func) {
            let index = this.customDrawsFinal.indexOf(func);
            if (index >= 0) {
                this.customDrawsFinal.splice(index, 1);
            }
        }
        GetCoordinate() {
            return this.coord;
        }
        ClearCanvas() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        DrawCoordinate(deltaMs) {
            this.coord.Draw(deltaMs, this.context);
        }
        DrawConvexObjs(deltaMs) {
            for (let i = 0; i < this.convexObjs.length; ++i) {
                this.convexObjs[i].Draw(deltaMs, this.coord, this.context);
            }
        }
        GetConvexObjsCount() {
            return this.convexObjs.length;
        }
        GetConvex(index) {
            return this.convexObjs[index];
        }
        //We always use (A - B) to calculate Minkowski Difference
        GetConvexAB() {
            if (this.convexObjs.length != 2) {
                return null;
            }
            let convexObjs = [this.convexObjs[0], this.convexObjs[1]];
            convexObjs.sort((a, b) => {
                return GJKTutorial.EncodeCustomCharCode(a.name) - GJKTutorial.EncodeCustomCharCode(b.name);
            });
            return { A: convexObjs[0], B: convexObjs[1] };
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
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Framework.js.map
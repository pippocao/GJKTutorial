//This is for draw custom convex on the coordinate
var GJKTutorial;
(function (GJKTutorial) {
    function GetAvailableCoordinateName(framework, isSmallCase, excludedNames) {
        let currentCharCodesSet = {};
        for (let i = 0; i < framework.GetConvexObjsCount(); ++i) {
            let convex = framework.GetConvex(i);
            if (convex instanceof GJKTutorial.Polygon) {
                let polygon = convex;
                for (let j = 0; j < polygon.GetVertices().length; ++j) {
                    let name = polygon.GetVertices()[j].name;
                    if (!name) {
                        continue;
                    }
                    name = isSmallCase ? name.toLowerCase() : name.toUpperCase();
                    currentCharCodesSet[name] = true;
                }
            }
            else {
                let name = convex.name;
                if (!name) {
                    continue;
                }
                name = isSmallCase ? name.toLowerCase() : name.toUpperCase();
                currentCharCodesSet[name] = true;
            }
        }
        if (excludedNames) {
            excludedNames.forEach((name) => {
                currentCharCodesSet[isSmallCase ? name.toLowerCase() : name.toUpperCase()] = true;
            });
        }
        let code = 0; //custom code of latter 'a';
        while (true) {
            let name = GJKTutorial.DecodeCustomCharCode(code, isSmallCase);
            if (!currentCharCodesSet[name]) {
                return name;
            }
            ++code;
        }
        return null; //wtf ? This should not happen;
    }
    function InitShowCase_DrawCustomConvex(framework, canvas, buttonClear, buttonBeginAdd, buttonFinishAdd, buttonCancel, addTypeSelector) {
        buttonClear.onclick = function () {
            while (framework.GetConvexObjsCount() > 0) {
                framework.RemoveConvex(0);
            }
        };
        let addType = 1; //1 Polygon, 2 Circle, 3 Capsule.
        let penddingVertices = [];
        let currentMousePos = new GJKTutorial.Vec2(0, 0);
        let customDrawPenddingVertex = (deltaMs, coord, context) => {
            if (penddingVertices.length == 0) {
                return;
            }
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            if (addType == 1) {
                let startPos = coord.GetCanvasPosByCoord(penddingVertices[0].coord);
                for (let i = 0; i < penddingVertices.length; ++i) {
                    let pos = coord.GetCanvasPosByCoord(penddingVertices[i].coord);
                    context.beginPath();
                    context.arc(pos.x, pos.y, 10, 0, 2 * Math.PI, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.closePath();
                    context.fillText(penddingVertices[i].name, pos.x, pos.y);
                }
                context.moveTo(startPos.x, startPos.y);
                context.beginPath();
                for (let i = 0; i < penddingVertices.length; ++i) {
                    let pos = coord.GetCanvasPosByCoord(penddingVertices[i].coord);
                    context.lineWidth = 1;
                    context.strokeStyle = 'black';
                    context.lineTo(pos.x, pos.y);
                }
                context.stroke();
                context.closePath();
            }
            else if (addType == 2) {
                if (penddingVertices.length >= 1) {
                    let centerPos = coord.GetCanvasPosByCoord(penddingVertices[0].coord);
                    context.beginPath();
                    context.arc(centerPos.x, centerPos.y, 10, 0, 2 * Math.PI, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.closePath();
                    context.beginPath();
                    context.lineWidth = 1;
                    context.strokeStyle = 'black';
                    let radius = currentMousePos.Sub(centerPos).magnitude;
                    context.arc(centerPos.x, centerPos.y, radius, 0, 360, false);
                    context.stroke();
                    context.closePath();
                }
            }
        };
        let canvasClickListener = (evt) => {
            if (evt.button == 0) {
                //Left Mouse Button
                let pos = new GJKTutorial.Vec2(evt.offsetX, evt.offsetY);
                let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
                let excludedNames = [];
                penddingVertices.forEach((vertex) => {
                    excludedNames.push(vertex.name);
                });
                let name = GetAvailableCoordinateName(framework, true, excludedNames);
                let vertex = new GJKTutorial.Vertex(coord, name);
                vertex.drawName = false;
                penddingVertices.push(vertex);
                if (addType == 2 && penddingVertices.length >= 2) {
                    FinishAdd();
                }
                else if (addType == 3 && penddingVertices.length >= 3) {
                    FinishAdd();
                }
            }
        };
        let canvasMoveListener = (evt) => {
            currentMousePos = new GJKTutorial.Vec2(evt.offsetX, evt.offsetY);
        };
        let canvasRightClickListener = function (evt) {
            evt.preventDefault();
            penddingVertices.pop();
        };
        let BeginAdd = function () {
            if (framework.GetConvexObjsCount() >= 2) {
                alert("More than 2 Convex Object is not allowed, please clear the convex objects first");
                return;
            }
            addTypeSelector.setAttribute("disabled", "true");
            buttonCancel.removeAttribute("disabled");
            buttonFinishAdd.removeAttribute("disabled");
            buttonBeginAdd.setAttribute("disabled", "true");
            addType = Number.parseInt(addTypeSelector.value);
            canvas.addEventListener('click', canvasClickListener);
            canvas.addEventListener('mousemove', canvasMoveListener);
            //RightMouseButton
            canvas.addEventListener('contextmenu', canvasRightClickListener);
            framework.AddCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
        let FinishAdd = function () {
            if (addType == 1 && customDrawPenddingVertex.length >= 3) {
                let convex = new GJKTutorial.Polygon();
                for (let i = 0; i < penddingVertices.length; ++i) {
                    let vertex = penddingVertices[i];
                    vertex.drawName = true;
                    convex.AddVertex(vertex);
                }
                convex.name = GetAvailableCoordinateName(framework, false, null);
                convex.ReOrder();
                if (convex.IsConvex()) {
                    framework.AddConvex(convex);
                }
                else {
                    window.alert("Only Convex Object are allowed!");
                }
            }
            else if (addType == 2 && customDrawPenddingVertex.length >= 2) {
                let radius = penddingVertices[0].coord.Sub(penddingVertices[1].coord).magnitude;
                let convex = new GJKTutorial.Circle(penddingVertices[0].coord, radius);
                convex.name = GetAvailableCoordinateName(framework, false, null);
                framework.AddConvex(convex);
            }
            penddingVertices = [];
            addTypeSelector.removeAttribute("disabled");
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true");
            buttonFinishAdd.setAttribute("disabled", "true");
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('mousemove', canvasMoveListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
        let CancelAdd = function () {
            addTypeSelector.removeAttribute("disabled");
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true");
            buttonFinishAdd.setAttribute("disabled", "true");
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('mousemove', canvasMoveListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            penddingVertices = [];
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
        buttonBeginAdd.onclick = BeginAdd;
        buttonFinishAdd.onclick = FinishAdd;
        buttonCancel.onclick = CancelAdd;
    }
    GJKTutorial.InitShowCase_DrawCustomConvex = InitShowCase_DrawCustomConvex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=ShowCase_AddConvex.js.map
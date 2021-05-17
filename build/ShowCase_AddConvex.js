//This is for draw custom convex on the coordinate
var GJKTutorial;
(function (GJKTutorial) {
    function GetNameFromCustomCharCode(code, isSmallCase) {
        let startAsciiCode = isSmallCase ? 97 : 65; //97 is ascii code of letter 'a' while 65 is that of letter 'A';
        let name = '';
        do {
            let tail = code % 26;
            name = String.fromCharCode(startAsciiCode + tail) + name;
            code = (code - tail) / 26;
        } while (code > 0);
        return name;
    }
    function GetAvailableCoordinateName(framework, isSmallCase, excludedNames) {
        let currentCharCodesSet = {};
        for (let i = 0; i < framework.GetConvexObjsCount(); ++i) {
            let convex = framework.GetConvex(i);
            for (let j = 0; j < convex.GetVertices().length; ++j) {
                let name = convex.GetVertices()[j].name;
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
            let name = GetNameFromCustomCharCode(code, isSmallCase);
            if (!currentCharCodesSet[name]) {
                return name;
            }
            ++code;
        }
        return null; //wtf ? This should not happen;
    }
    function InitShowCase_DrawCustomConvex(framework, canvas, buttonClear, buttonBeginAdd, buttonFinishAdd, buttonCancel) {
        buttonClear.onclick = function () {
            while (framework.GetConvexObjsCount() > 0) {
                framework.RemoveConvex(0);
            }
        };
        let penddingVertices = [];
        let customDrawPenddingVertex = (deltaMs, coord, context) => {
            if (penddingVertices.length == 0) {
                return;
            }
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            let startPos = coord.GetCanvasPosByCoord(penddingVertices[0].coord);
            for (let i = 0; i < penddingVertices.length; ++i) {
                let pos = coord.GetCanvasPosByCoord(penddingVertices[i].coord);
                context.beginPath();
                context.arc(pos.x, pos.y, 10, 0, 2 * Math.PI, false);
                context.fillStyle = 'black';
                context.fill();
                context.closePath();
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
            }
        };
        let canvasRightClickListener = function (evt) {
            evt.preventDefault();
            penddingVertices.pop();
        };
        buttonBeginAdd.onclick = function () {
            buttonCancel.removeAttribute("disabled");
            buttonFinishAdd.removeAttribute("disabled");
            buttonBeginAdd.setAttribute("disabled", "true");
            canvas.addEventListener('click', canvasClickListener);
            //RightMouseButton
            canvas.addEventListener('contextmenu', canvasRightClickListener);
            framework.AddCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
        buttonFinishAdd.onclick = function () {
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true");
            buttonFinishAdd.setAttribute("disabled", "true");
            let convex = new GJKTutorial.Convex();
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
            penddingVertices = [];
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
        buttonCancel.onclick = function () {
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true");
            buttonFinishAdd.setAttribute("disabled", "true");
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            penddingVertices = [];
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        };
    }
    GJKTutorial.InitShowCase_DrawCustomConvex = InitShowCase_DrawCustomConvex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=ShowCase_AddConvex.js.map
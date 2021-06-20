var GJKTutorial;
(function (GJKTutorial) {
    function GetFullMinkowskiDiffVertices(conv1, conv2) {
        let result = [];
        let poly1 = conv1;
        let poly2 = conv2;
        if (!(poly1 instanceof GJKTutorial.Polygon) || !(poly2 instanceof GJKTutorial.Polygon)) {
            window.alert("Only Polygon Objects can draw Full Minkowski Difference!");
            return result;
        }
        for (let i = 0; i < poly1.GetVertices().length; ++i) {
            for (let j = 0; j < poly2.GetVertices().length; ++j) {
                let vertex = new GJKTutorial.Vertex(poly1.GetVertices()[i].coord.Sub(poly2.GetVertices()[j].coord), "");
                let simplexVertex = new GJKTutorial.SimplexVertex(vertex, poly1.GetVertices()[i].coord, poly2.GetVertices()[j].coord);
                simplexVertex.drawName = false;
                simplexVertex.name = poly1.GetVertices()[i].name + "-" + poly2.GetVertices()[j].name;
                result.push(simplexVertex);
            }
        }
        return result;
    }
    function InitShowCase_MinkowskiDiff(framework, buttonShowMinkowskiDiff) {
        let drawEdgeNum = -1;
        let timeBeginMs = 0;
        let allVertices = [];
        let drawFullMinkowskiDiff = (deltaMs, coord, context) => {
            let convexAB = framework.GetConvexAB();
            if (!convexAB || drawEdgeNum == -1) {
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;
            allVertices = GetFullMinkowskiDiffVertices(convexA, convexB);
            if (allVertices.length < 3) {
                return;
            }
            let diffOutlineVertices = GJKTutorial.GetConvexFromVertices(allVertices);
            if (diffOutlineVertices.length < 3) {
                return;
            }
            if (drawEdgeNum > diffOutlineVertices.length + 1) {
                drawEdgeNum = -1;
                return;
            }
            let finishedDrawAllEdges = (drawEdgeNum > diffOutlineVertices.length);
            //Draw Candidiate Vertices When Show Animation
            if (!finishedDrawAllEdges) {
                for (let i = 0; i < allVertices.length; ++i) {
                    let ve = allVertices[i];
                    let pos = coord.GetCanvasPosByCoord(ve.coord);
                    context.lineWidth = 0;
                    context.fillStyle = 'red';
                    context.moveTo(pos.x, pos.y);
                    context.beginPath();
                    context.arc(pos.x, pos.y, 3, 0, 360, false);
                    context.fill();
                    context.closePath();
                    context.fillText(allVertices[i].name + "", pos.x, pos.y);
                }
            }
            //Draw Edges
            let startPos = coord.GetCanvasPosByCoord(diffOutlineVertices[0].coord);
            context.moveTo(startPos.x, startPos.y);
            context.beginPath();
            context.setLineDash([]); //solidLine
            context.strokeStyle = 'green';
            context.lineWidth = finishedDrawAllEdges ? 0.5 : 2;
            for (let i = 0; i < Math.min(diffOutlineVertices.length + 1, drawEdgeNum); ++i) {
                let pos = coord.GetCanvasPosByCoord(diffOutlineVertices[i % diffOutlineVertices.length].coord);
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            if (finishedDrawAllEdges) {
                context.fillStyle = '#00FF2228';
                context.fill();
            }
            context.closePath();
            //Animation
            if (!finishedDrawAllEdges && drawEdgeNum > 0) {
                let fromDir = new GJKTutorial.Vec2(0, 1);
                if (drawEdgeNum > 1) {
                    fromDir = diffOutlineVertices[drawEdgeNum - 1].coord.Sub(diffOutlineVertices[drawEdgeNum - 2].coord);
                }
                let targetDir = diffOutlineVertices[drawEdgeNum % diffOutlineVertices.length].coord.Sub(diffOutlineVertices[drawEdgeNum - 1].coord);
                let currentDir = new GJKTutorial.Vec2(targetDir.x, targetDir.y);
                let targetDegree = fromDir.GetDegreeToCW(targetDir);
                let startPosAnim = coord.GetCanvasPosByCoord(diffOutlineVertices[drawEdgeNum - 1].coord);
                context.moveTo(startPosAnim.x, startPosAnim.y);
                context.beginPath();
                let currentDegree = (Date.now() - timeBeginMs) * 0.1;
                context.setLineDash([]);
                if (currentDegree < targetDegree) {
                    currentDir = fromDir.RotateCW(currentDegree);
                    context.strokeStyle = 'red';
                    context.lineWidth = 3;
                    context.setLineDash([3, 3]);
                }
                else {
                    context.strokeStyle = 'green';
                    context.lineWidth = 2;
                }
                currentDir = currentDir.Normalize().Mul(coord.coordXMax);
                let targetPos = coord.GetCanvasPosByCoord(diffOutlineVertices[drawEdgeNum - 1].coord.Add(currentDir));
                context.lineTo(startPosAnim.x, startPosAnim.y);
                context.lineTo(targetPos.x, targetPos.y);
                context.stroke();
                context.setLineDash([]);
                context.closePath();
            }
            //name of Vertices
            if (finishedDrawAllEdges) {
                diffOutlineVertices.forEach((vertex) => {
                    let pos = coord.GetCanvasPosByCoord(vertex.coord);
                    context.fillStyle = 'green';
                    context.font = "20px Arial";
                    context.fillText(vertex.name + "(" + GJKTutorial.numToString(vertex.coord.x, 2) + "," + GJKTutorial.numToString(vertex.coord.y, 2) + ")", pos.x, pos.y);
                });
            }
        };
        framework.AddCustomDrawFunctionBeforeDrawConvex(drawFullMinkowskiDiff);
        buttonShowMinkowskiDiff.onclick = (evt) => {
            ++drawEdgeNum;
            timeBeginMs = Date.now();
        };
    }
    GJKTutorial.InitShowCase_MinkowskiDiff = InitShowCase_MinkowskiDiff;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=ShowCase_MinkowskiDiff.js.map
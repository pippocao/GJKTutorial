var GJKTutorial;
(function (GJKTutorial) {
    function GetFullMinkowskiDiffVertices(conv1, conv2) {
        let result = [];
        for (let i = 0; i < conv1.GetVertices().length; ++i) {
            for (let j = 0; j < conv2.GetVertices().length; ++j) {
                let vertex = new GJKTutorial.Vertex(conv1.GetVertices()[i].coord.Sub(conv2.GetVertices()[j].coord), "");
                vertex.drawName = false;
                vertex.name = conv1.GetVertices()[i].name + "-" + conv2.GetVertices()[j].name;
                result.push(vertex);
            }
        }
        return result;
    }
    function GetConvexFromVertices(vertices) {
        let result = new GJKTutorial.Convex();
        result.drawName = false;
        let startVertexIndex = -1;
        for (let i = 0; i < vertices.length; ++i) {
            let vertex = vertices[i];
            if (startVertexIndex < 0) {
                startVertexIndex = i;
            }
            else if (vertex.coord.x < vertices[startVertexIndex].coord.x) {
                startVertexIndex = i;
            }
            else if (vertex.coord.x == vertices[startVertexIndex].coord.x && vertex.coord.y > vertices[startVertexIndex].coord.y) {
                startVertexIndex = i;
            }
        }
        let startVertex = vertices[startVertexIndex];
        result.AddVertex(startVertex);
        while (true) {
            let fromDir = new GJKTutorial.Vec2(0, 1); //up direction
            for (let i = result.GetVertices().length - 1; i > 0; --i) {
                let dir = result.GetVertices()[i].coord.Sub(result.GetVertices()[i - 1].coord);
                if (dir.magnitudeSqr != 0) {
                    fromDir = dir;
                    break;
                }
            }
            let currentStartCoord = result.GetVertices()[result.GetVertices().length - 1].coord;
            let nextVertexIndex = -1;
            let nextVertexDegree = Number.MAX_VALUE;
            for (let i = 0; i < vertices.length; ++i) {
                let candidiateCoord = vertices[i].coord;
                let candidiateDir = candidiateCoord.Sub(currentStartCoord);
                if (Math.abs(candidiateDir.x) < Number.EPSILON && Math.abs(candidiateDir.y) < Number.EPSILON) {
                    //ignore overlapping vertex
                    continue;
                }
                let candidiateDegreeCw = fromDir.GetDegreeToCW(candidiateDir);
                if (candidiateDegreeCw < nextVertexDegree) {
                    nextVertexIndex = i;
                    nextVertexDegree = candidiateDegreeCw;
                }
            }
            let nextVertex = vertices[nextVertexIndex];
            if (nextVertex == startVertex) {
                break;
            }
            result.AddVertex(nextVertex);
        }
        return result;
    }
    function InitShowCase_MinkowskiDiff(framework, buttonShowMinkowskiDiff) {
        let drawEdgeNum = -1;
        let timeBeginMs = 0;
        let allVertices = [];
        let diffConv = null;
        let drawFullMinkowskiDiff = (deltaMs, coord, context) => {
            if (framework.GetConvexObjsCount() != 2 || drawEdgeNum == -1) {
                return;
            }
            allVertices = GetFullMinkowskiDiffVertices(framework.GetConvex(1), framework.GetConvex(0));
            diffConv = GetConvexFromVertices(allVertices);
            if (diffConv.GetVertices().length < 3) {
                return;
            }
            if (drawEdgeNum > diffConv.GetVertices().length + 1) {
                drawEdgeNum = -1;
                return;
            }
            let finishedDrawAllEdges = (drawEdgeNum > diffConv.GetVertices().length);
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
                    context.fillText(i + "", pos.x, pos.y);
                }
            }
            //Draw Edges
            let startPos = coord.GetCanvasPosByCoord(diffConv.GetVertices()[0].coord);
            context.moveTo(startPos.x, startPos.y);
            context.beginPath();
            context.setLineDash([]); //solidLine
            context.strokeStyle = 'green';
            context.lineWidth = finishedDrawAllEdges ? 0.5 : 2;
            for (let i = 0; i < Math.min(diffConv.GetVertices().length + 1, drawEdgeNum); ++i) {
                let pos = coord.GetCanvasPosByCoord(diffConv.GetVertices()[i % diffConv.GetVertices().length].coord);
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
                    fromDir = diffConv.GetVertices()[drawEdgeNum - 1].coord.Sub(diffConv.GetVertices()[drawEdgeNum - 2].coord);
                }
                let targetDir = diffConv.GetVertices()[drawEdgeNum % diffConv.GetVertices().length].coord.Sub(diffConv.GetVertices()[drawEdgeNum - 1].coord);
                let currentDir = new GJKTutorial.Vec2(targetDir.x, targetDir.y);
                let targetDegree = fromDir.GetDegreeToCW(targetDir);
                let startPosAnim = coord.GetCanvasPosByCoord(diffConv.GetVertices()[drawEdgeNum - 1].coord);
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
                let targetPos = coord.GetCanvasPosByCoord(diffConv.GetVertices()[drawEdgeNum - 1].coord.Add(currentDir));
                context.lineTo(startPosAnim.x, startPosAnim.y);
                context.lineTo(targetPos.x, targetPos.y);
                context.stroke();
                context.setLineDash([]);
                context.closePath();
            }
            //name of Vertices
            if (finishedDrawAllEdges) {
                diffConv.GetVertices().forEach((vertex) => {
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
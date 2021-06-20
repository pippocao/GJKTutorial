var GJKTutorial;
(function (GJKTutorial) {
    class Polygon extends GJKTutorial.Convex {
        constructor() {
            super(...arguments);
            this.vertices = [];
        }
        AddVertex(vertex) {
            this.vertices.push(vertex);
        }
        RemoveVertex(index) {
            this.vertices.splice(index, 1);
        }
        SetVertices(vertices) {
            this.vertices = [...vertices];
        }
        GetVertices() {
            return this.vertices;
        }
        Translate(offset) {
            for (let i = 0; i < this.vertices.length; ++i) {
                this.vertices[i].coord = this.vertices[i].coord.Add(offset);
            }
        }
        //re-order the vertices, try to make this polygon convex(CW order).
        ReOrder() {
            let verticesTmp = [...this.vertices];
            let newVerticesTmp = [];
            if (verticesTmp.length < 3) {
                return;
            }
            let firstVertexIndex = -1;
            let minX = Number.MAX_SAFE_INTEGER;
            let maxY = Number.MIN_SAFE_INTEGER;
            for (let i = 0; i < verticesTmp.length; ++i) {
                if (verticesTmp[i].coord.x < minX
                    || (verticesTmp[i].coord.x == minX && verticesTmp[i].coord.y > maxY)) {
                    minX = verticesTmp[i].coord.x;
                    maxY = verticesTmp[i].coord.y;
                    firstVertexIndex = i;
                }
            }
            newVerticesTmp.push(verticesTmp.splice(firstVertexIndex, 1)[0]);
            let startVertex = newVerticesTmp[0];
            let upDir = new GJKTutorial.Vec2(0, 1);
            verticesTmp.sort((a, b) => {
                let dirA = a.coord.Sub(startVertex.coord);
                let dirB = b.coord.Sub(startVertex.coord);
                let magnitudeA = dirA.magnitude;
                let magnitudeB = dirB.magnitude;
                if (magnitudeA == 0) {
                    return -1;
                }
                else if (magnitudeB == 0) {
                    return 1;
                }
                dirA = dirA.Normalize();
                dirB = dirB.Normalize();
                let dotA = upDir.Dot(dirA);
                let dotB = upDir.Dot(dirB);
                if (dotA != dotB) {
                    return dotB - dotA;
                }
                if (a.coord.y >= startVertex.coord.y) {
                    return magnitudeA - magnitudeB;
                }
                else {
                    return magnitudeB - magnitudeA;
                }
                return 1;
            });
            newVerticesTmp.push(...verticesTmp);
            this.vertices = newVerticesTmp;
        }
        Rebuild() {
            this.vertices = GJKTutorial.GetConvexFromVertices(this.vertices);
        }
        IsConvex() {
            if (this.vertices.length < 3) {
                return false;
            }
            let lastCross = 0;
            for (let i = 0; i < this.vertices.length; ++i) {
                let point = this.vertices[i];
                let point_prev = this.vertices[(i - 1 + this.vertices.length) % this.vertices.length];
                let point_next = this.vertices[(i + 1) % this.vertices.length];
                let vector1 = point.coord.Sub(point_prev.coord);
                let vector2 = point_next.coord.Sub(point.coord);
                let cross = vector1.Cross(vector2);
                if (lastCross == 0) {
                    lastCross = cross;
                }
                else if (cross != 0) {
                    if (cross * lastCross < 0) {
                        return false;
                    }
                    lastCross = cross;
                }
            }
            return true;
        }
        IsPointInConvex(point) {
            if (this.vertices.length < 3) {
                return false;
            }
            let lastCross = 0;
            for (let i = 0; i < this.vertices.length; ++i) {
                let point_current = this.vertices[i];
                let point_next = this.vertices[(i + 1) % this.vertices.length];
                let vector1 = point_next.coord.Sub(point_current.coord);
                let vector2 = point.Sub(point_current.coord);
                let cross = vector1.Cross(vector2);
                if (lastCross == 0) {
                    lastCross = cross;
                }
                else if (cross != 0) {
                    if (cross * lastCross < 0) {
                        return false;
                    }
                    lastCross = cross;
                }
            }
            return true;
        }
        GetCenterCoord() {
            let center = new GJKTutorial.Vec2();
            let sumWeight = 0;
            for (let i = 0; i < this.vertices.length; ++i) {
                let point = this.vertices[i];
                let point_prev = this.vertices[(i - 1 + this.vertices.length) % this.vertices.length];
                let point_next = this.vertices[(i + 1) % this.vertices.length];
                let weight = point.coord.Sub(point_prev.coord).magnitude + point.coord.Sub(point_next.coord).magnitude;
                center = center.Add(point.coord.Mul(weight));
                sumWeight += weight;
            }
            return center.Div(sumWeight);
        }
        Support(dir) {
            let maxDot = Number.MIN_SAFE_INTEGER;
            let supportVertex = null;
            for (let i = 0; i < this.vertices.length; ++i) {
                let candidiateVertex = this.vertices[i];
                let dot = candidiateVertex.coord.Dot(dir);
                if (dot > maxDot) {
                    maxDot = dot;
                    supportVertex = candidiateVertex;
                }
            }
            return supportVertex;
        }
        Draw(deltaMs, coord, context, strokeColor, fillColor) {
            if (this.vertices.length <= 0) {
                return;
            }
            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = strokeColor;
            let beginPos = coord.GetCanvasPosByCoord(this.vertices[0].coord);
            context.moveTo(beginPos.x, beginPos.y);
            for (let i = 1; i <= this.vertices.length; ++i) {
                let pos = coord.GetCanvasPosByCoord(this.vertices[i % this.vertices.length].coord);
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            context.closePath();
            context.fillStyle = this.fillColor;
            context.fill();
            for (let i = 0; i < this.vertices.length; ++i) {
                this.vertices[i].Draw(deltaMs, coord, context);
            }
            if (this.drawName && this.name) {
                let pos = coord.GetCanvasPosByCoord(this.GetCenterCoord());
                context.fillStyle = 'black';
                context.font = "40px Arial";
                context.fillText(this.name, pos.x, pos.y);
            }
        }
    }
    GJKTutorial.Polygon = Polygon;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Polygon.js.map
var GJKTutorial;
(function (GJKTutorial) {
    class Simplex extends GJKTutorial.Polygon {
        IncludeOrigin() {
            return this.IsPointInConvex(new GJKTutorial.Vec2(0, 0));
        }
        AddVertex(vertex) {
            super.AddVertex(vertex);
        }
        SetVertices(vertices) {
            super.SetVertices(vertices);
        }
        GetVertices() {
            return super.GetVertices();
        }
        //return null if vertices count is less than 2.
        GetClosestEdgeToOrigin() {
            if (this.GetVertices().length < 2) {
                return null;
            }
            else if (this.GetVertices().length == 2) {
                return this.GetVertices();
            }
            let closestDistanceSqr = Number.MAX_SAFE_INTEGER;
            let resultVertices = [null, null];
            let origin = new GJKTutorial.Vec2(0, 0);
            for (let i = 0; i < this.GetVertices().length; ++i) {
                let p0 = this.GetVertices()[i];
                let p1 = this.GetVertices()[(i + 1) % this.GetVertices().length];
                let distanceSqr = GJKTutorial.PointDistanceToSegmentSqr(origin, p0.coord, p1.coord);
                if (distanceSqr < closestDistanceSqr) {
                    closestDistanceSqr = distanceSqr;
                    resultVertices[0] = p0;
                    resultVertices[1] = p1;
                }
            }
            return resultVertices;
        }
    }
    GJKTutorial.Simplex = Simplex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Simplex.js.map
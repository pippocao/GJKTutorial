var GJKTutorial;
(function (GJKTutorial) {
    class Simplex extends GJKTutorial.Convex {
        IncludeOrigin() {
            return this.IsPointInConvex(new GJKTutorial.Vec2(0, 0));
        }
        GetNearestCloseToOriginVerteices(num) {
            let resultVertices = [...this.GetVertices()];
            if (resultVertices.length > num) {
                //only reserve 2 vertices who are nearest to Origin(0, 0);
                resultVertices.sort((a, b) => {
                    return a.coord.magnitudeSqr - b.coord.magnitudeSqr;
                });
                resultVertices = resultVertices.slice(0, num);
            }
            return resultVertices;
        }
        //result maybe null if vertices count is less than 2
        GetBestNextSupportDir() {
            let nearestVertices = this.GetNearestCloseToOriginVerteices(2);
            if (nearestVertices.length < 2) {
                return null;
            }
            let dir = nearestVertices[0].coord.Sub(nearestVertices[1].coord);
            let supportDir = new GJKTutorial.Vec2(-dir.y, dir.x);
            if (nearestVertices[0].coord.Dot(supportDir) > 0) {
                supportDir = supportDir.Mul(-1);
            }
            return supportDir;
        }
    }
    GJKTutorial.Simplex = Simplex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Simplex.js.map
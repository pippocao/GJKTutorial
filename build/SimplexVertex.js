var GJKTutorial;
(function (GJKTutorial) {
    //This type of vertex is used for Simplex
    class SimplexVertex extends GJKTutorial.Vertex {
        constructor(diffVertex, convexACoord, convexBCoord) {
            super(diffVertex.coord, diffVertex.name);
            this.m_convexACoord = convexACoord.Clone();
            this.m_convexBCoord = convexBCoord.Clone();
        }
        GetConvexCoordA() {
            return this.m_convexACoord;
        }
        GetConvexCoordB() {
            return this.m_convexBCoord;
        }
    }
    GJKTutorial.SimplexVertex = SimplexVertex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=SimplexVertex.js.map
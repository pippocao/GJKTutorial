var GJKTutorial;
(function (GJKTutorial) {
    //This type of vertex is used for Simplex
    class SimplexVertex extends GJKTutorial.Vertex {
        constructor(diffVertex, convexAVertex, convexBVertex) {
            super(diffVertex.coord, diffVertex.name);
            this.m_convexAVertex = convexAVertex;
            this.m_convexBVertex = convexBVertex;
        }
        GetConvexVerticeA() {
            return this.m_convexAVertex;
        }
        GetConvexVerticeB() {
            return this.m_convexBVertex;
        }
    }
    GJKTutorial.SimplexVertex = SimplexVertex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=SimplexVertex.js.map
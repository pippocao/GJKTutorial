module GJKTutorial
{
    //This type of vertex is used for Simplex
    export class SimplexVertex extends Vertex
    {
        private m_convexAVertex : Vertex;
        private m_convexBVertex : Vertex;

        constructor(diffVertex : Vertex, convexAVertex : Vertex, convexBVertex : Vertex)
        {
            super(diffVertex.coord, diffVertex.name);
            this.m_convexAVertex = convexAVertex;
            this.m_convexBVertex = convexBVertex;
        }

        public GetConvexVerticeA() : Readonly<Vertex>
        {
            return this.m_convexAVertex;
        }
        
        public GetConvexVerticeB() : Readonly<Vertex>
        {
            return this.m_convexBVertex;
        }
    }
}
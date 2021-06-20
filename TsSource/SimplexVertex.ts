module GJKTutorial
{
    //This type of vertex is used for Simplex
    export class SimplexVertex extends Vertex
    {
        private m_convexACoord : Vec2;
        private m_convexBCoord : Vec2;

        constructor(diffVertex : Vertex, convexACoord : Vec2, convexBCoord : Vec2)
        {
            super(diffVertex.coord, diffVertex.name);
            this.m_convexACoord = convexACoord.Clone();
            this.m_convexBCoord = convexBCoord.Clone();
        }

        public GetConvexCoordA() : Readonly<Vec2>
        {
            return this.m_convexACoord;
        }
        
        public GetConvexCoordB() : Readonly<Vec2>
        {
            return this.m_convexBCoord;
        }
    }
}
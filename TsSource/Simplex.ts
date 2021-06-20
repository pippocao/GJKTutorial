module GJKTutorial
{
    export class Simplex extends Polygon
    {
        public IncludeOrigin() : boolean
        {
            return this.IsPointInConvex(new Vec2(0, 0));
        }

        public AddVertex(vertex : SimplexVertex) : void
        {
            super.AddVertex(vertex);
        }

        public SetVertices(vertices : ReadonlyArray<SimplexVertex>) : void
        {
            super.SetVertices(vertices);
        }

        public GetVertices() : ReadonlyArray<SimplexVertex>
        {
            return super.GetVertices() as ReadonlyArray<SimplexVertex>;
        }

        //return null if vertices count is less than 2.
        public GetClosestEdgeToOrigin() : ReadonlyArray<SimplexVertex>
        {
            if(this.GetVertices().length < 2)
            {
                return null;
            }else if(this.GetVertices().length == 2)
            {
                return this.GetVertices() as ReadonlyArray<SimplexVertex>;
            }
            let closestDistanceSqr = Number.MAX_SAFE_INTEGER;
            let resultVertices : SimplexVertex[] = [null, null];
            let origin:Readonly<Vec2> = new Vec2(0, 0);
            for(let i = 0; i < this.GetVertices().length; ++i)
            {
                let p0 = this.GetVertices()[i] as SimplexVertex;
                let p1 = this.GetVertices()[(i + 1) % this.GetVertices().length] as SimplexVertex;

                let distanceSqr = PointDistanceToSegmentSqr(origin, p0.coord, p1.coord);
                if(distanceSqr < closestDistanceSqr)
                {
                    closestDistanceSqr = distanceSqr;
                    resultVertices[0] = p0;
                    resultVertices[1] = p1;
                }
            }
            return resultVertices;
        }
    }
}
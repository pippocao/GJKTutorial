module GJKTutorial
{
    export class Simplex extends Convex
    {
        public IncludeOrigin() : boolean
        {
            return this.IsPointInConvex(new Vec2(0, 0));
        }

        //return null if vertices count is less than 2.
        public GetClosestEdgeToOrigin() : ReadonlyArray<Vertex>
        {
            if(this.GetVertices().length < 2)
            {
                return null;
            }else if(this.GetVertices().length == 2)
            {
                return this.GetVertices();
            }
            let closestDistanceSqr = Number.MAX_SAFE_INTEGER;
            let resultVertices : Vertex[] = [null, null];
            let origin:Readonly<Vec2> = new Vec2(0, 0);
            for(let i = 0; i < this.GetVertices().length; ++i)
            {
                let p0 = this.GetVertices()[i];
                let p1 = this.GetVertices()[(i + 1) % this.GetVertices().length];

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

        //result maybe null if vertices count is less than 2
        public GetBestNextSupportDir() : Vec2
        {
            let nearestVertices = this.GetClosestEdgeToOrigin();
            if(!nearestVertices)
            {
                return null;
            }
            let dir = nearestVertices[0].coord.Sub(nearestVertices[1].coord);

            let supportDir = new Vec2(-dir.y, dir.x);

            if(nearestVertices[0].coord.Dot(supportDir) > 0)
            {
                supportDir = supportDir.Mul(-1);
            }
            return supportDir;
        }
    }
}
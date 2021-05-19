module GJKTutorial
{




    export function SupportDifference(convexA : Convex, convexB : Convex, supportDir : Vec2) : {diff : Vertex, vertexA : Vertex, vertexB:Vertex}
    {
        let supportA = convexA.Support(supportDir);
        let supportB = convexB.Support(supportDir.Mul(-1));
        let vertex = new Vertex(supportA.coord.Sub(supportB.coord), supportA.name + "-" + supportB.name);
        return {diff : vertex, vertexA : supportA, vertexB:supportB};
    }


    ///////////////////////////////////////////////////////////////GJK Part///////////////////////////////////////////////////////////
    export class GJKStepResult
    {
        public supportDir : Vec2 = new Vec2();
        public simplex : Simplex = new Simplex();
    }

    //result maybe null if vertices count is less than 2
    export function GJKGetBestNextSupportDir(simplex : Simplex) : Vec2
    {
        let nearestVertices = simplex.GetClosestEdgeToOrigin();
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
        

    //mingkowski difference (A - B);
    //this is only for step by step demonstration
    export function GJKStep(convexA : Convex, convexB : Convex, supportDir : Vec2, lastStep? : GJKStepResult) : GJKStepResult
    {
        let stepResult = new GJKStepResult();
        stepResult.supportDir = supportDir.Clone();


        let newSimplexVertices : SimplexVertex[] = [];
        if(lastStep)
        {
            let edge = lastStep.simplex.GetClosestEdgeToOrigin();
            if(edge)
            {
                newSimplexVertices = [...edge];
            }else{
                //last simplex has only a point;
                newSimplexVertices = [...lastStep.simplex.GetVertices()];
            }
        }

        let supportDifference = SupportDifference(convexA, convexB, supportDir);
        let simplexVertex = new SimplexVertex(supportDifference.diff, supportDifference.vertexA, supportDifference.vertexB);
        newSimplexVertices.push(simplexVertex);
        stepResult.simplex.SetVertices(newSimplexVertices);
        return stepResult;
    }



    //do full GJK test, if collision detected it will return the last simplex, otherwise null will be returned;
    //This is not the best optimized algorithm, but it can clearly show the GJK algorithm.
    //So it is only for demonstration.
    export function GJKTest(convexA : Convex, convexB : Convex) : Simplex
    {
        let simplex : Simplex = new Simplex();
        let supportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
        let initSupportDifference = SupportDifference(convexA, convexB, supportDir);
        let initSimplexVertex = new SimplexVertex(initSupportDifference.diff, initSupportDifference.vertexA, initSupportDifference.vertexB);
        simplex.AddVertex(initSimplexVertex);
        supportDir = supportDir.Mul(-1);
        while(true)
        {
            let supportDifference = SupportDifference(convexA, convexB, supportDir);
            let simplexVertex = new SimplexVertex(supportDifference.diff, supportDifference.vertexA, supportDifference.vertexB);
            if(simplexVertex.coord.Dot(supportDir) <= 0)
            {
                //will never collid
                return null;
            }
            if(simplex.GetVertices().length > 2)
            {
                simplex.SetVertices(simplex.GetClosestEdgeToOrigin());
            }
            simplex.AddVertex(simplexVertex);
            if(simplex.IsPointInConvex(new Vec2(0, 0)))
            {
                return simplex;
            }
            supportDir = GJKGetBestNextSupportDir(simplex);
        }
    }
    ///////////////////////////////////////////////////////////////GJK Part///////////////////////////////////////////////////////////



    
    ///////////////////////////////////////////////////////////////EPA Part///////////////////////////////////////////////////////////
    export class EPAStepResult
    {
        public supportDir : Vec2 = new Vec2();
        public simplex : Simplex = new Simplex();
    }


    //result maybe null if vertices count is less than 2
    export function EPAGetBestNextSupportDir(simplex : Simplex) : Vec2
    {
        let nearestVertices = simplex.GetClosestEdgeToOrigin();
        if(!nearestVertices)
        {
            return null;
        }
        let dir = nearestVertices[0].coord.Sub(nearestVertices[1].coord);

        let supportDir = new Vec2(-dir.y, dir.x);

        if(nearestVertices[0].coord.Dot(supportDir) < 0)
        {
            supportDir = supportDir.Mul(-1);
        }
        return supportDir;
    }


    //mingkowski difference (A - B);
    //this is only for step by step demonstration
    export function EPAStep(convexA : Convex, convexB : Convex, lastStep : EPAStepResult) : EPAStepResult
    {
        let stepResult = new EPAStepResult();
        stepResult.simplex = new Simplex();
        stepResult.simplex.SetVertices(lastStep.simplex.GetVertices());

        stepResult.supportDir = EPAGetBestNextSupportDir(stepResult.simplex);

        let mingkowskiDiffVertex = SupportDifference(convexA, convexB, stepResult.supportDir);
        let newSimplexVertex = new SimplexVertex(mingkowskiDiffVertex.diff, mingkowskiDiffVertex.vertexA, mingkowskiDiffVertex.vertexB);
        stepResult.simplex.AddVertex(newSimplexVertex);
        stepResult.simplex.Rebuild();
        return stepResult;
    }


    //if step is the final iteration result of EPA
    //calculate the penetration depth and correspond points on ConvexA and ConvexB
    export function ResolveEPAStep(step : EPAStepResult) : {penetrationDepthAtoB : Vec2, penetrationPointOnConvexA : Vec2, penetrationPointOnConvexB : Vec2}
    {
        //draw the penetration vertices.
        let closestEdgeToOrigin = step.simplex.GetClosestEdgeToOrigin();
        let closestToOriginPointOnEdge = NearestPointOnSegment(new Vec2(0, 0), closestEdgeToOrigin[0].coord, closestEdgeToOrigin[1].coord);

        let penetrationCoordA : Vec2 = null;
        let penetrationCoordB : Vec2 = null;

        let convexAEdgeMagnitudeSqr = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Sub(closestEdgeToOrigin[1].GetConvexVerticeA().coord).magnitudeSqr;
        let convexBEdgeMagnitudeSqr = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Sub(closestEdgeToOrigin[1].GetConvexVerticeB().coord).magnitudeSqr;
        if(convexAEdgeMagnitudeSqr == 0)
        {
            penetrationCoordA = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Clone();
        }else{
            penetrationCoordA = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Add(closestToOriginPointOnEdge.Sub(closestEdgeToOrigin[0].coord));
        }
        
        if(convexBEdgeMagnitudeSqr == 0)
        {
            penetrationCoordB = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Clone();
        }else{
            //convexB is minuend in minkowski difference, so we use - instead of +
            penetrationCoordB = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Sub(closestToOriginPointOnEdge.Sub(closestEdgeToOrigin[0].coord));
        }

        return {penetrationDepthAtoB : penetrationCoordA.Sub(penetrationCoordB), penetrationPointOnConvexA : penetrationCoordA, penetrationPointOnConvexB : penetrationCoordB};
    }

    //This is not the best optimized algorithm, but it can clearly show the EPA algorithm.
    //So it is only for demonstration.
    //RETURN : null if convexA and convexB is not collided
    export function EAPTest(convexA : Convex, convexB : Convex) : {penetrationDepthAtoB : Vec2, penetrationPointOnConvexA : Vec2, penetrationPointOnConvexB : Vec2}
    {
        let initSimplex = GJKTest(convexA, convexB);
        if(!initSimplex)
        {
            return null;
        }
        let lastStep = new EPAStepResult();
        lastStep.simplex = initSimplex;
        lastStep.supportDir = EPAGetBestNextSupportDir(initSimplex);
        while(true)
        {
            let newStep = EPAStep(convexA, convexB, lastStep);
            if(lastStep.simplex.GetVertices().length == newStep.simplex.GetVertices().length)
            {
                //iteration quit
                return ResolveEPAStep(lastStep);
            }else{
                lastStep = newStep;
            }
        }
    }
    ///////////////////////////////////////////////////////////////EPA Part///////////////////////////////////////////////////////////


    
    ///////////////////////////////////////////////////////////////GJK Raycast Part///////////////////////////////////////////////////
    export class GJKRaycastStepResult
    {
        public lamda : number = 0;    //current length of the ray
        public supportDir : Vec2 = new Vec2();
        public simplex : Simplex = new Simplex();
    }

    export function GJKRaycast(convexA : Convex, convexB : Convex, ray : Raycast, lastStep? : GJKRaycastStepResult) : GJKRaycastStepResult
    {
        if(!lastStep)
        {
            //it's first step
        }
        return null;
    }
    ///////////////////////////////////////////////////////////////GJK Raycast Part///////////////////////////////////////////////////
}
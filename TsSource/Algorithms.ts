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
        let simplexVertex = new SimplexVertex(supportDifference.diff, supportDifference.vertexA.coord, supportDifference.vertexB.coord);
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
        let initSimplexVertex = new SimplexVertex(initSupportDifference.diff, initSupportDifference.vertexA.coord, initSupportDifference.vertexB.coord);
        simplex.AddVertex(initSimplexVertex);
        supportDir = supportDir.Mul(-1);
        while(true)
        {
            let supportDifference = SupportDifference(convexA, convexB, supportDir);
            let simplexVertex = new SimplexVertex(supportDifference.diff, supportDifference.vertexA.coord, supportDifference.vertexB.coord);
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
        public closestEdgeToOrigin : SimplexVertex[] = null;
        public closestToOriginPointOnEdge : Vec2 = null;
        public closestDistanceSqr : number = Number.MIN_SAFE_INTEGER;
        public isLastStep : boolean = false;
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

        /* This is fast but have some accuracy issue
        if(nearestVertices[0].coord.Dot(supportDir) < 0)
        {
            supportDir = supportDir.Mul(-1);
        }*/

        if(simplex.GetVertices()[1].coord.Sub(simplex.GetVertices()[0].coord)
            .Cross(simplex.GetVertices()[2].coord.Sub(simplex.GetVertices()[1].coord)) < 0)
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

        let mingkowskiDiffVertex = SupportDifference(convexA, convexB, lastStep.supportDir);
        let newSimplexVertex = new SimplexVertex(mingkowskiDiffVertex.diff, mingkowskiDiffVertex.vertexA.coord, mingkowskiDiffVertex.vertexB.coord);
        stepResult.simplex.AddVertex(newSimplexVertex);
        stepResult.simplex.Rebuild();
        if(stepResult.simplex.GetVertices().length <= lastStep.simplex.GetVertices().length)
        {
            stepResult.isLastStep = true;
            stepResult.supportDir = lastStep.supportDir;
            stepResult.closestEdgeToOrigin = [...lastStep.closestEdgeToOrigin];
            stepResult.closestToOriginPointOnEdge = lastStep.closestToOriginPointOnEdge.Clone();
            stepResult.closestDistanceSqr = lastStep.closestDistanceSqr;
        }else{
            stepResult.supportDir = EPAGetBestNextSupportDir(stepResult.simplex);
            stepResult.closestEdgeToOrigin = [...stepResult.simplex.GetClosestEdgeToOrigin()];
            stepResult.closestToOriginPointOnEdge = ClosestPointOnSegment(new Vec2(0, 0), stepResult.closestEdgeToOrigin[0].coord, stepResult.closestEdgeToOrigin[1].coord);
            stepResult.closestDistanceSqr = stepResult.closestToOriginPointOnEdge.magnitudeSqr;
        }

        return stepResult;
    }


    //if step is the final iteration result of EPA
    //calculate the penetration depth and correspond points on ConvexA and ConvexB
    export function ResolveEPAStep(step : EPAStepResult) : {penetrationDepthAtoB : Vec2, penetrationPointOnConvexA : Vec2, penetrationPointOnConvexB : Vec2}
    {
        let penetrationCoordA : Vec2 = null;
        let penetrationCoordB : Vec2 = null;

        let convexAEdgeMagnitudeSqr = step.closestEdgeToOrigin[0].GetConvexCoordA().Sub(step.closestEdgeToOrigin[1].GetConvexCoordA()).magnitudeSqr;
        let convexBEdgeMagnitudeSqr = step.closestEdgeToOrigin[0].GetConvexCoordB().Sub(step.closestEdgeToOrigin[1].GetConvexCoordB()).magnitudeSqr;

        //p, p1, p2 must be collineation (p1, p, p2 is on a line)
        let GetRatio = function(p : Vec2, p1 : Vec2, p2 : Vec2) : number
        {
            let diffX = p1.x - p2.x;
            let diffY = p1.y - p2.y;
            if(diffX == 0 && diffY == 0)
            {
                return 1;
            }
            if(Math.abs(diffX) > Math.abs(diffY))
            {
                return (p.x - p1.x) / (p2.x - p1.x);
            }else{
                return (p.x - p1.x) / (p2.x - p1.x);
            }
        }

        if(Math.abs(convexAEdgeMagnitudeSqr) < Number.EPSILON)
        {
            penetrationCoordA = step.closestEdgeToOrigin[0].GetConvexCoordA().Clone();
        }else{
            let ratio = GetRatio(step.closestToOriginPointOnEdge, step.closestEdgeToOrigin[0].coord, step.closestEdgeToOrigin[1].coord);
            penetrationCoordA = Lerp01(step.closestEdgeToOrigin[0].GetConvexCoordA(), step.closestEdgeToOrigin[1].GetConvexCoordA(), ratio);
        }
        
        if(Math.abs(convexBEdgeMagnitudeSqr) < Number.EPSILON)
        {
            penetrationCoordB = step.closestEdgeToOrigin[0].GetConvexCoordB().Clone();
        }else{
            let ratio = GetRatio(step.closestToOriginPointOnEdge, step.closestEdgeToOrigin[0].coord, step.closestEdgeToOrigin[1].coord);
            penetrationCoordB = Lerp01(step.closestEdgeToOrigin[0].GetConvexCoordB(), step.closestEdgeToOrigin[1].GetConvexCoordB(), ratio);
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
            if(newStep.isLastStep)
            {
                //iteration quit
                return ResolveEPAStep(newStep);
            }else{
                lastStep = newStep;
            }
        }
    }

    ///////////////////////////////////////////////////////////////EPA Part///////////////////////////////////////////////////////////




    ///////////////////////////////////////////////////////////////Raycast Part///////////////////////////////////////////////////////////
    export class GJKRaycastStepResult
    {
        public contextB : Convex;
        public minLength : number = 0;
        public simplex : Simplex = new Simplex();
        public degeneratedSimplex : Simplex = new Simplex();  //for next step
        public closestPointToOriginAfterMoving : Vec2;   //the start point for next step
        public supportDir : Vec2;
        public currentAnimLength : number = 0;
    }


    export class GJKRaycastHitResult
    {
        public pointA : Vec2;
        public pointB : Vec2;
        public distance : number;
        public normalA: Vec2;
        public normalB : Vec2;
    }




    
    //this is only for step by step demonstration, it's not the optimized algorithm
    //ray is the movement of convexB
    //the simplex in returned result value will include only 1 vertex which is closest to origin.
    export function GJKRaycastStep(convexA : Convex, convexB : Convex, ray : Raycast, lastStepResult? : GJKRaycastStepResult) : GJKRaycastStepResult
    {
        let result : GJKRaycastStepResult = new GJKRaycastStepResult();
        if(!lastStepResult)
        {
            //it's the first time
            result.minLength = 0;
            let initSupportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
            let initSupportDiff = SupportDifference(convexA, convexB, initSupportDir);
            result.simplex.AddVertex(new SimplexVertex(initSupportDiff.diff, initSupportDiff.vertexA.coord, initSupportDiff.vertexB.coord));
            result.closestPointToOriginAfterMoving = result.simplex.GetVertices()[0].coord;
            result.degeneratedSimplex = new Simplex();
            result.degeneratedSimplex.SetVertices(result.simplex.GetVertices());
            result.supportDir = result.simplex.GetVertices()[0].coord.Mul(-1);
            return result;
        }
        
        let closestPointToOrigin = lastStepResult.closestPointToOriginAfterMoving;
        result.simplex.SetVertices(lastStepResult.degeneratedSimplex.GetVertices());
        result.supportDir = closestPointToOrigin.Mul(-1);
        let newSupportDiff = SupportDifference(convexA, convexB, result.supportDir);
        let newSupportDiffVertex = new SimplexVertex(newSupportDiff.diff, newSupportDiff.vertexA.coord, newSupportDiff.vertexB.coord);
        result.simplex.AddVertex(newSupportDiffVertex);
        let dotSupportDiffVertices = (closestPointToOrigin.Dot(newSupportDiffVertex.coord));
        if(dotSupportDiffVertices > 0)
        {
            result.minLength += dotSupportDiffVertices / ray.Dir.Dot(closestPointToOrigin);
        }else{
            result.minLength = 0;
        }

        //calculate degenerate
        let offset = ray.Dir.Mul(-result.minLength);
        result.simplex.Translate(offset);


        let mostClosestEdge = result.simplex.GetClosestEdgeToOrigin();

        let mostClosestPoint = ClosestPointOnSegment(new Vec2(0, 0), result.simplex.GetVertices()[0].coord, result.simplex.GetVertices()[1].coord);
        result.closestPointToOriginAfterMoving = mostClosestPoint;
        if(mostClosestPoint.Equals(mostClosestEdge[0].coord))
        {
            result.degeneratedSimplex.SetVertices([mostClosestEdge[0]]);
        }
        if(mostClosestPoint.Equals(mostClosestEdge[1].coord))
        {
            result.degeneratedSimplex.SetVertices([mostClosestEdge[1]]);
        }else{
            result.degeneratedSimplex.SetVertices([mostClosestEdge[0], mostClosestEdge[1]]);
        }
        result.simplex.Translate(offset.Mul(-1));
        return result;
    }

    //full GJK Raycast , return null if raycast test failed.
    export function GJKRaycast(convexA : Convex, convexB : Convex, ray : Raycast) : GJKRaycastHitResult
    {
        let lumda = 0;
        let initSupportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
        let initSupportDiff = SupportDifference(convexA, convexB, initSupportDir);
        let simplex = new Simplex();
        simplex.AddVertex(new SimplexVertex(initSupportDiff.diff, initSupportDiff.vertexA.coord, initSupportDiff.vertexB.coord));
        let closestPointToOrigin = simplex.GetVertices()[0].coord;
        let supportDir = simplex.GetVertices()[0].coord.Mul(-1);
        let closestDistance = Number.MAX_SAFE_INTEGER;
        while(true)
        {
            let newSupportDiff = SupportDifference(convexA, convexB, supportDir);
            newSupportDiff.diff.coord = newSupportDiff.diff.coord.Sub(ray.Dir.Mul(lumda));
            let newSupportDiffVertex = new SimplexVertex(newSupportDiff.diff, newSupportDiff.vertexA.coord, newSupportDiff.vertexB.coord);
            let dotSupportDiffVertices = (closestPointToOrigin.Dot(newSupportDiffVertex.coord));
            if(dotSupportDiffVertices > 0)
            {
                let needMoveDistance = dotSupportDiffVertices / ray.Dir.Dot(closestPointToOrigin);
                if(needMoveDistance < 0)
                {
                    return null;
                }
                let newLumda = lumda + needMoveDistance;
                if(lumda > ray.Length)
                {
                    return null;
                }
                let offsetDistance = newLumda - lumda;
                lumda = newLumda;
                simplex.AddVertex(newSupportDiffVertex);
                simplex.Translate(ray.Dir.Mul(-offsetDistance));
                closestDistance = Number.MAX_SAFE_INTEGER;
            }else{
                simplex.AddVertex(newSupportDiffVertex)
            }

            //calculate degenerate
            let mostClosestEdge = simplex.GetClosestEdgeToOrigin();

            closestPointToOrigin = ClosestPointOnSegment(new Vec2(0, 0), mostClosestEdge[0].coord, mostClosestEdge[1].coord);
            if(closestPointToOrigin.Equals(mostClosestEdge[0].coord))
            {
                simplex.SetVertices([mostClosestEdge[0]]);
            }
            if(closestPointToOrigin.Equals(mostClosestEdge[1].coord))
            {
                simplex.SetVertices([mostClosestEdge[1]]);
            }else{
                simplex.SetVertices([mostClosestEdge[0], mostClosestEdge[1]]);
            }
            supportDir = closestPointToOrigin.Mul(-1);
            let distance = closestPointToOrigin.magnitudeSqr;
            if((closestPointToOrigin.magnitudeSqr < Number.EPSILON || distance >= closestDistance))
            {
                if(lumda > 0)
                {
                    let result = new GJKRaycastHitResult();
                    result.distance = lumda;
                    if(simplex.GetVertices().length == 1)
                    {
                        result.pointA = simplex.GetVertices()[0].GetConvexCoordA();
                        result.pointB = simplex.GetVertices()[0].GetConvexCoordB();
                        result.normalA = ray.Dir.Mul(-1);
                        result.normalB = ray.Dir.Clone();
                    }else{
                        let ratioTo0 = closestPointToOrigin.Sub(simplex.GetVertices()[0].coord).magnitude / simplex.GetVertices()[1].coord.Sub(simplex.GetVertices()[0].coord).magnitude;
                        result.pointA = Lerp01(simplex.GetVertices()[0].GetConvexCoordA(), simplex.GetVertices()[1].GetConvexCoordA(), ratioTo0);
                        result.pointB = Lerp01(simplex.GetVertices()[0].GetConvexCoordB(), simplex.GetVertices()[1].GetConvexCoordB(), ratioTo0);
    
                        let normal = simplex.GetVertices()[0].coord.Sub(simplex.GetVertices()[1].coord);
                        normal = new Vec2(-normal.y, normal.x).Normalize();
    
                        if(normal.Dot(ray.Dir) > 0)
                        {
                            result.normalB = normal;
                            result.normalA = normal.Mul(-1);
                        }else{
                            result.normalB = normal.Mul(-1);
                            result.normalA = normal;
                        }
                    }
                    return result;
                }else{
                    return null;
                }
            }
            closestDistance = distance;
        }
    }
    ///////////////////////////////////////////////////////////////Raycast Part///////////////////////////////////////////////////////////
}
var GJKTutorial;
(function (GJKTutorial) {
    function SupportDifference(convexA, convexB, supportDir) {
        let supportA = convexA.Support(supportDir);
        let supportB = convexB.Support(supportDir.Mul(-1));
        let vertex = new GJKTutorial.Vertex(supportA.coord.Sub(supportB.coord), supportA.name + "-" + supportB.name);
        return { diff: vertex, vertexA: supportA, vertexB: supportB };
    }
    GJKTutorial.SupportDifference = SupportDifference;
    ///////////////////////////////////////////////////////////////GJK Part///////////////////////////////////////////////////////////
    class GJKStepResult {
        constructor() {
            this.supportDir = new GJKTutorial.Vec2();
            this.simplex = new GJKTutorial.Simplex();
        }
    }
    GJKTutorial.GJKStepResult = GJKStepResult;
    //result maybe null if vertices count is less than 2
    function GJKGetBestNextSupportDir(simplex) {
        let nearestVertices = simplex.GetClosestEdgeToOrigin();
        if (!nearestVertices) {
            return null;
        }
        let dir = nearestVertices[0].coord.Sub(nearestVertices[1].coord);
        let supportDir = new GJKTutorial.Vec2(-dir.y, dir.x);
        if (nearestVertices[0].coord.Dot(supportDir) > 0) {
            supportDir = supportDir.Mul(-1);
        }
        return supportDir;
    }
    GJKTutorial.GJKGetBestNextSupportDir = GJKGetBestNextSupportDir;
    //mingkowski difference (A - B);
    //this is only for step by step demonstration
    function GJKStep(convexA, convexB, supportDir, lastStep) {
        let stepResult = new GJKStepResult();
        stepResult.supportDir = supportDir.Clone();
        let newSimplexVertices = [];
        if (lastStep) {
            let edge = lastStep.simplex.GetClosestEdgeToOrigin();
            if (edge) {
                newSimplexVertices = [...edge];
            }
            else {
                //last simplex has only a point;
                newSimplexVertices = [...lastStep.simplex.GetVertices()];
            }
        }
        let supportDifference = SupportDifference(convexA, convexB, supportDir);
        let simplexVertex = new GJKTutorial.SimplexVertex(supportDifference.diff, supportDifference.vertexA, supportDifference.vertexB);
        newSimplexVertices.push(simplexVertex);
        stepResult.simplex.SetVertices(newSimplexVertices);
        return stepResult;
    }
    GJKTutorial.GJKStep = GJKStep;
    //do full GJK test, if collision detected it will return the last simplex, otherwise null will be returned;
    //This is not the best optimized algorithm, but it can clearly show the GJK algorithm.
    //So it is only for demonstration.
    function GJKTest(convexA, convexB) {
        let simplex = new GJKTutorial.Simplex();
        let supportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
        let initSupportDifference = SupportDifference(convexA, convexB, supportDir);
        let initSimplexVertex = new GJKTutorial.SimplexVertex(initSupportDifference.diff, initSupportDifference.vertexA, initSupportDifference.vertexB);
        simplex.AddVertex(initSimplexVertex);
        supportDir = supportDir.Mul(-1);
        while (true) {
            let supportDifference = SupportDifference(convexA, convexB, supportDir);
            let simplexVertex = new GJKTutorial.SimplexVertex(supportDifference.diff, supportDifference.vertexA, supportDifference.vertexB);
            if (simplexVertex.coord.Dot(supportDir) <= 0) {
                //will never collid
                return null;
            }
            if (simplex.GetVertices().length > 2) {
                simplex.SetVertices(simplex.GetClosestEdgeToOrigin());
            }
            simplex.AddVertex(simplexVertex);
            if (simplex.IsPointInConvex(new GJKTutorial.Vec2(0, 0))) {
                return simplex;
            }
            supportDir = GJKGetBestNextSupportDir(simplex);
        }
    }
    GJKTutorial.GJKTest = GJKTest;
    ///////////////////////////////////////////////////////////////GJK Part///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////EPA Part///////////////////////////////////////////////////////////
    class EPAStepResult {
        constructor() {
            this.supportDir = new GJKTutorial.Vec2();
            this.simplex = new GJKTutorial.Simplex();
        }
    }
    GJKTutorial.EPAStepResult = EPAStepResult;
    //result maybe null if vertices count is less than 2
    function EPAGetBestNextSupportDir(simplex) {
        let nearestVertices = simplex.GetClosestEdgeToOrigin();
        if (!nearestVertices) {
            return null;
        }
        let dir = nearestVertices[0].coord.Sub(nearestVertices[1].coord);
        let supportDir = new GJKTutorial.Vec2(-dir.y, dir.x);
        if (nearestVertices[0].coord.Dot(supportDir) < 0) {
            supportDir = supportDir.Mul(-1);
        }
        return supportDir;
    }
    GJKTutorial.EPAGetBestNextSupportDir = EPAGetBestNextSupportDir;
    //mingkowski difference (A - B);
    //this is only for step by step demonstration
    function EPAStep(convexA, convexB, lastStep) {
        let stepResult = new EPAStepResult();
        stepResult.simplex = new GJKTutorial.Simplex();
        stepResult.simplex.SetVertices(lastStep.simplex.GetVertices());
        stepResult.supportDir = EPAGetBestNextSupportDir(stepResult.simplex);
        let mingkowskiDiffVertex = SupportDifference(convexA, convexB, stepResult.supportDir);
        let newSimplexVertex = new GJKTutorial.SimplexVertex(mingkowskiDiffVertex.diff, mingkowskiDiffVertex.vertexA, mingkowskiDiffVertex.vertexB);
        stepResult.simplex.AddVertex(newSimplexVertex);
        stepResult.simplex.Rebuild();
        return stepResult;
    }
    GJKTutorial.EPAStep = EPAStep;
    //if step is the final iteration result of EPA
    //calculate the penetration depth and correspond points on ConvexA and ConvexB
    function ResolveEPAStep(step) {
        //draw the penetration vertices.
        let closestEdgeToOrigin = step.simplex.GetClosestEdgeToOrigin();
        let closestToOriginPointOnEdge = GJKTutorial.ClosestPointOnSegment(new GJKTutorial.Vec2(0, 0), closestEdgeToOrigin[0].coord, closestEdgeToOrigin[1].coord);
        let penetrationCoordA = null;
        let penetrationCoordB = null;
        let convexAEdgeMagnitudeSqr = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Sub(closestEdgeToOrigin[1].GetConvexVerticeA().coord).magnitudeSqr;
        let convexBEdgeMagnitudeSqr = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Sub(closestEdgeToOrigin[1].GetConvexVerticeB().coord).magnitudeSqr;
        if (convexAEdgeMagnitudeSqr == 0) {
            penetrationCoordA = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Clone();
        }
        else {
            penetrationCoordA = closestEdgeToOrigin[0].GetConvexVerticeA().coord.Add(closestToOriginPointOnEdge.Sub(closestEdgeToOrigin[0].coord));
        }
        if (convexBEdgeMagnitudeSqr == 0) {
            penetrationCoordB = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Clone();
        }
        else {
            //convexB is minuend in minkowski difference, so we use - instead of +
            penetrationCoordB = closestEdgeToOrigin[0].GetConvexVerticeB().coord.Sub(closestToOriginPointOnEdge.Sub(closestEdgeToOrigin[0].coord));
        }
        return { penetrationDepthAtoB: penetrationCoordA.Sub(penetrationCoordB), penetrationPointOnConvexA: penetrationCoordA, penetrationPointOnConvexB: penetrationCoordB };
    }
    GJKTutorial.ResolveEPAStep = ResolveEPAStep;
    //This is not the best optimized algorithm, but it can clearly show the EPA algorithm.
    //So it is only for demonstration.
    //RETURN : null if convexA and convexB is not collided
    function EAPTest(convexA, convexB) {
        let initSimplex = GJKTest(convexA, convexB);
        if (!initSimplex) {
            return null;
        }
        let lastStep = new EPAStepResult();
        lastStep.simplex = initSimplex;
        lastStep.supportDir = EPAGetBestNextSupportDir(initSimplex);
        while (true) {
            let newStep = EPAStep(convexA, convexB, lastStep);
            if (lastStep.simplex.GetVertices().length == newStep.simplex.GetVertices().length) {
                //iteration quit
                return ResolveEPAStep(lastStep);
            }
            else {
                lastStep = newStep;
            }
        }
    }
    GJKTutorial.EAPTest = EAPTest;
    ///////////////////////////////////////////////////////////////EPA Part///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////Raycast Part///////////////////////////////////////////////////////////
    class GJKRaycastStepResult {
        constructor() {
            this.minLength = 0;
            this.simplex = new GJKTutorial.Simplex();
            this.currentAnimLength = 0;
        }
    }
    GJKTutorial.GJKRaycastStepResult = GJKRaycastStepResult;
    //this is only for step by step demonstration, it's not the optimized algorithm
    //ray is the movement of convexB
    //the simplex in returned result value will include only 1 vertex which is closest to origin.
    function GJKRaycastStep(convexA, convexB, ray, lastStepResult) {
        let result = new GJKRaycastStepResult();
        if (!lastStepResult) {
            //it's the first time
            result.minLength = 0;
            let initSupportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
            let initSupportDiff = SupportDifference(convexA, convexB, initSupportDir);
            result.simplex.AddVertex(new GJKTutorial.SimplexVertex(initSupportDiff.diff, initSupportDiff.vertexA, initSupportDiff.vertexB));
            result.degenerated_0_Simplex = result.simplex.GetVertices()[0];
            return result;
        }
        let lastSupportDiffVertex = lastStepResult.degenerated_0_Simplex;
        lastStepResult.simplex.AddVertex(lastSupportDiffVertex);
        let newSupportDiff = SupportDifference(convexA, convexB, lastSupportDiffVertex.coord.Mul(-1));
        let newSupportDiffVertex = new GJKTutorial.SimplexVertex(newSupportDiff.diff, newSupportDiff.vertexA, newSupportDiff.vertexB);
        lastStepResult.simplex.AddVertex(newSupportDiffVertex);
        let dotSupportDiffVertices = (lastSupportDiffVertex.coord.Dot(newSupportDiffVertex.coord));
        if (dotSupportDiffVertices > 0) {
            result.minLength += dotSupportDiffVertices / ray.Dir.Dot(lastSupportDiffVertex.coord);
        }
        else {
            result.minLength = lastStepResult.minLength;
        }
        //calculate degenerate
        let offset = ray.Dir.Mul(result.minLength);
        result.simplex.Translate(offset);
        let mostClosestPoint = GJKTutorial.ClosestPointOnSegment(new GJKTutorial.Vec2(0, 0), result.simplex.GetVertices()[0].coord, result.simplex.GetVertices()[1].coord);
        if (mostClosestPoint.Equals(result.simplex.GetVertices()[0].coord)) {
            result.degenerated_0_Simplex = result.simplex.GetVertices()[0];
        }
        if (mostClosestPoint.Equals(result.simplex.GetVertices()[1].coord)) {
            result.degenerated_0_Simplex = result.simplex.GetVertices()[1];
        }
        else {
            result.degenerated_0_Simplex = new GJKTutorial.SimplexVertex(new GJKTutorial.Vertex(mostClosestPoint, 'unnamed'), null, null); //a temporary simplex vertex, must not be the final raycast result.
        }
        result.simplex.Translate(offset.Mul(-1));
        return result;
    }
    GJKTutorial.GJKRaycastStep = GJKRaycastStep;
    ///////////////////////////////////////////////////////////////Raycast Part///////////////////////////////////////////////////////////
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Algorithms.js.map
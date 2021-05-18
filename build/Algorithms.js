var GJKTutorial;
(function (GJKTutorial) {
    class GJKStepResult {
        constructor() {
            this.supportDir = new GJKTutorial.Vec2();
            this.simplex = new GJKTutorial.Simplex();
        }
    }
    GJKTutorial.GJKStepResult = GJKStepResult;
    function SupportDifference(convexA, convexB, supportDir) {
        let supportA = convexA.Support(supportDir);
        let supportB = convexB.Support(supportDir.Mul(-1));
        let vertex = new GJKTutorial.Vertex(supportA.coord.Sub(supportB.coord), supportA.name + "-" + supportB.name);
        return vertex;
    }
    GJKTutorial.SupportDifference = SupportDifference;
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
        newSimplexVertices.push(SupportDifference(convexA, convexB, supportDir));
        stepResult.simplex.SetVertices(newSimplexVertices);
        return stepResult;
    }
    GJKTutorial.GJKStep = GJKStep;
    //do full GJK test, if collision detected it will return the last simplex, otherwise null will be returned;
    function GJKTest(convexA, convexB) {
        let simplex = new GJKTutorial.Simplex();
        let supportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
        simplex.AddVertex(SupportDifference(convexA, convexB, supportDir));
        supportDir = supportDir.Mul(-1);
        while (true) {
            let simplexVertex = SupportDifference(convexA, convexB, supportDir);
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
            supportDir = simplex.GetBestNextSupportDir();
        }
    }
    GJKTutorial.GJKTest = GJKTest;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Algorithms.js.map
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
    function GJKStep(convexA, convexB, supportDir, lastStep) {
        let stepResult = new GJKStepResult();
        stepResult.supportDir = supportDir.Clone();
        let newSimplexVertices = lastStep ? lastStep.simplex.GetNearestCloseToOriginVerteices(2) : [];
        newSimplexVertices.push(SupportDifference(convexA, convexB, supportDir));
        for (let i = 0; i < newSimplexVertices.length; ++i) {
            stepResult.simplex.AddVertex(newSimplexVertices[i]);
        }
        return stepResult;
    }
    GJKTutorial.GJKStep = GJKStep;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Algorithms.js.map
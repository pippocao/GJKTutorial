module GJKTutorial
{
    export class GJKStepResult
    {
        public supportDir : Vec2 = new Vec2();
        public simplex : Simplex = new Simplex();
    }


    export function SupportDifference(convexA : Convex, convexB : Convex, supportDir : Vec2) : Vertex
    {
        let supportA = convexA.Support(supportDir);
        let supportB = convexB.Support(supportDir.Mul(-1));
        let vertex = new Vertex(supportA.coord.Sub(supportB.coord), supportA.name + "-" + supportB.name);
        return vertex;
    }


    //mingkowski difference (A - B);
    export function GJKStep(convexA : Convex, convexB : Convex, supportDir : Vec2, lastStep? : GJKStepResult) : GJKStepResult
    {
        let stepResult = new GJKStepResult();
        stepResult.supportDir = supportDir.Clone();

        let newSimplexVertices : Vertex[] = lastStep ? lastStep.simplex.GetNearestCloseToOriginVerteices(2) : [];

        newSimplexVertices.push(SupportDifference(convexA, convexB, supportDir));
        for(let i = 0; i < newSimplexVertices.length; ++i)
        {
            stepResult.simplex.AddVertex(newSimplexVertices[i]);
        }
        return stepResult;
    }
}
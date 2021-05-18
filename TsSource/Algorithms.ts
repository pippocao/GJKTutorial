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
    //this is only for step by step demonstration
    export function GJKStep(convexA : Convex, convexB : Convex, supportDir : Vec2, lastStep? : GJKStepResult) : GJKStepResult
    {
        let stepResult = new GJKStepResult();
        stepResult.supportDir = supportDir.Clone();


        let newSimplexVertices : Vertex[] = [];
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

        newSimplexVertices.push(SupportDifference(convexA, convexB, supportDir));
        stepResult.simplex.SetVertices(newSimplexVertices);
        return stepResult;
    }



    //do full GJK test, if collision detected it will return the last simplex, otherwise null will be returned;
    export function GJKTest(convexA : Convex, convexB : Convex) : Simplex
    {
        let simplex : Simplex = new Simplex();
        let supportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
        simplex.AddVertex(SupportDifference(convexA, convexB, supportDir));
        supportDir = supportDir.Mul(-1);
        while(true)
        {
            let simplexVertex = SupportDifference(convexA, convexB, supportDir);
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
            supportDir = simplex.GetBestNextSupportDir();
        }
    }
}
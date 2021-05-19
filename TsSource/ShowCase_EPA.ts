module GJKTutorial
{
    export function InitShowCase_DrawEPAStep(framework : Framework, canvas:HTMLCanvasElement, epaStepBtn:HTMLElement, epaUndoBtn:HTMLElement, epaClearBtn:HTMLElement, epaPushOutToggleBtn:HTMLElement, ) : void
    {
        let stepStack : EPAStepResult[] = [];

        //Draw
        let drawEPACustom = function(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(stepStack.length == 0)
            {
                return;
            }
            let drawStep = stepStack[stepStack.length - 1];

            context.lineWidth = 1;
            context.strokeStyle = '#cc112266';
            context.fillStyle = '#cc112266';

            //draw lines and try to fill
            let startPos = coord.GetCanvasPosByCoord(drawStep.simplex.GetVertices()[0].coord);
            context.moveTo(startPos.x, startPos.y);
            context.beginPath();
            for(let i = 0; i < drawStep.simplex.GetVertices().length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(drawStep.simplex.GetVertices()[i].coord);
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            context.fill();
            context.closePath();


            //draw support dir
            let startCoord = new Vec2(0, 0);
            startPos = coord.GetCanvasPosByCoord(startCoord);
            let endPos = coord.GetCanvasPosByCoord(startCoord.Add(drawStep.supportDir));
            let bestLength = canvas.width / 4;
            endPos = startPos.Add(endPos.Sub(startPos).Normalize().Mul(bestLength));
            drawArrow(context, startPos, endPos, bestLength / 10, 4, 'red');

            //check if epa is finished.
            let bFinished = (stepStack.length >= 2 && stepStack[stepStack.length - 2].simplex.GetVertices().length == drawStep.simplex.GetVertices().length);
            if(bFinished)
            {
                let resolveResult = ResolveEPAStep(drawStep);

                drawArrow(context, coord.GetCanvasPosByCoord(resolveResult.penetrationPointOnConvexA), coord.GetCanvasPosByCoord(resolveResult.penetrationPointOnConvexB), 0, 2, 'blue');
            }
        }
        framework.AddCustomDrawFunctionAfterDrawConvex(drawEPACustom);


        

        epaClearBtn.onclick = (evt)=>{
            stepStack = [];
        };

        epaUndoBtn.onclick = (evt)=>{
            stepStack.pop();
        }


        epaStepBtn.onclick = (evt)=>{
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;

            let lastStepResult = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            let stepResult : EPAStepResult = null;
            if(!lastStepResult)
            {
                //It's the first step, use the gjk result simplex as the basic simplex.
                let simplexGJKResult = GJKTest(convexA, convexB);
                if(!simplexGJKResult)
                {
                    return;
                }
                stepResult = new EPAStepResult();
                stepResult.simplex = simplexGJKResult;
                //give a next suggested support dir
                stepResult.supportDir = EPAGetBestNextSupportDir(stepResult.simplex);
            }else{
                stepResult = EPAStep(convexA, convexB, lastStepResult);
            }

            stepStack.push(stepResult);
        }

        let autoPushOutHandle = -1;
        let autoPushOutEnable = false;

        function epaPushOutUpdate(dtMs : number)
        {
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;
            let epaResult = EAPTest(convexA, convexB);
            if(!epaResult)
            {
                return;
            }
            let pushObj = convexB;
            let pushDir = epaResult.penetrationDepthAtoB;
            if(draggingConvexObj == convexB)
            {
                pushObj = convexA;
                pushDir = pushDir.Mul(-1);
            }

            let distance = 10 / 1000 * dtMs;   //move 10 unit coord per second
            pushDir = pushDir.Normalize();
            pushObj.Translate(pushDir.Mul(distance));
        }

        epaPushOutToggleBtn.onclick = (evt)=>{
            if(!autoPushOutEnable)
            {
                autoPushOutEnable = true;
                let lastUpdateTimeMs = Date.now();
                autoPushOutHandle = setInterval(()=>{
                    let currentTimeMs = Date.now();
                    let delta = currentTimeMs - lastUpdateTimeMs;
                    epaPushOutUpdate(delta);
                    lastUpdateTimeMs = currentTimeMs;
                }, 16);
            }else{
                clearInterval(autoPushOutHandle);
                autoPushOutEnable = false;
            }
        }
    }
}
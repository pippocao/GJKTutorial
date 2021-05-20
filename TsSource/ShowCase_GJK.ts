module GJKTutorial
{
    export function InitShowCase_DrawGJKStep(framework : Framework, canvas:HTMLCanvasElement, gjkStepBtn:HTMLElement, gjkUndoBtn:HTMLElement, gjkClearBtn:HTMLElement) : void
    {
        let stepStack : GJKStepResult[] = [];
        let currentSupportDir : Vec2 = new Vec2(0, 0);
        let currentSupportDirStartCoord : Vec2 = new Vec2(0, 0);

        //Draw
        let drawGJKCustom = function(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(stepStack.length == 0)
            {
                return;
            }
            let drawStep = stepStack[stepStack.length - 1];

            context.lineWidth = 1;
            context.strokeStyle = '#cc112266';
            context.fillStyle = '#cc112266';

            //draw vertices
            for(let i = 0; i < drawStep.simplex.GetVertices().length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(drawStep.simplex.GetVertices()[i].coord);
                context.beginPath();
                context.arc(pos.x, pos.y, 10, 0, 2 * Math.PI, false);
                context.fill();
                context.closePath();
            }

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
            if(drawStep.simplex.GetVertices().length > 2)
            {
                context.fill();
            }
            context.closePath();


            //draw support dir
            startPos = coord.GetCanvasPosByCoord(currentSupportDirStartCoord);
            let endPos = coord.GetCanvasPosByCoord(currentSupportDirStartCoord.Add(currentSupportDir));
            let bestLength = canvas.width / 4;
            endPos = startPos.Add(endPos.Sub(startPos).Normalize().Mul(bestLength));
            drawArrow(context, startPos, endPos, bestLength / 10, 4, 'red');
        }
        framework.AddCustomDrawFunctionAfterDrawConvex(drawGJKCustom);


        //Manually configure support dir
        let bMouseDown = false;
        canvas.addEventListener('mousedown', (evt)=>{
            if(evt.button != 0)
            {
                return;
            }
            let pos = new Vec2(evt.offsetX, evt.offsetY);
            currentSupportDirStartCoord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            bMouseDown = true;
        });

        canvas.addEventListener('mouseup', (evt)=>{
            if(evt.button != 0)
            {
                return;
            }
            let pos = new Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            currentSupportDir = coord.Sub(currentSupportDirStartCoord);
            bMouseDown = false;
        });

        
        canvas.addEventListener('mousemove', (evt)=>{
            if(evt.button != 0 || !bMouseDown)
            {
                return;
            }
            let pos = new Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            currentSupportDir = coord.Sub(currentSupportDirStartCoord);
        });
        

        gjkClearBtn.onclick = (evt)=>{
            stepStack = [];
            EnableDraggingConvexObj();
        };

        gjkUndoBtn.onclick = (evt)=>{
            if(stepStack.length > 1)
            {
                let undoStep = stepStack.pop();
                if(undoStep)
                {
                    currentSupportDir = undoStep.supportDir;
                    currentSupportDirStartCoord = undoStep['supportDirStart'];
                    if(!currentSupportDirStartCoord)
                    {
                        currentSupportDirStartCoord = new Vec2(0, 0);
                    }
                }
            }
        }


        gjkStepBtn.onclick = (evt)=>{
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;
            
            let lastStepResult = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            if(!lastStepResult)
            {
                DisableDraggingConvexObj();
                //it's the first step, we specify the dir from convexB to convexA as the support dir
                currentSupportDir = convexA.GetCenterCoord().Sub(convexB.GetCenterCoord());
            }
            let stepResult = GJKStep(convexA, convexB, currentSupportDir, lastStepResult);
            stepResult['supportDirStart'] = currentSupportDirStartCoord;
            stepStack.push(stepResult);

            //give a suggested support dir
            currentSupportDir = GJKGetBestNextSupportDir(stepResult.simplex);
            if(!currentSupportDir)
            {
                //after first step, there is only 1 vertex in simplex, so we must specify a support dir.
                currentSupportDir = convexB.GetCenterCoord().Sub(convexA.GetCenterCoord());
                currentSupportDirStartCoord = convexA.GetCenterCoord();
            }else{
                let nearestVertices = stepResult.simplex.GetClosestEdgeToOrigin();
                currentSupportDirStartCoord = nearestVertices[0].coord.Add(nearestVertices[1].coord).Div(2);
            }
        }
    }
}
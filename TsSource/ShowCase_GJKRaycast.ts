module GJKTutorial
{
    enum showStepStatus
    {
        None,
        BeforeAnim,
        Anim,
        AfterAnim
    };

    export function InitShowCase_DrawGJKRaycastStep(framework : Framework, canvas:HTMLCanvasElement, stepBtn:HTMLElement, undoBtn:HTMLElement, clearBtn:HTMLElement) : void
    {
        let stepStack : GJKRaycastStepResult[] = [];
        let ray:Raycast = null;
        let animUpdateIntervalHandle : number = -1;
        let status = showStepStatus.None;

        //Draw
        let drawGJKCustom = function(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(ray == null)
            {
                return;
            }
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return;
            }
            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            if(lastStep)
            {
                //draw Simplex
                context.strokeStyle = '#ff00ffAA';
                context.fillStyle = '#ff00ffAA';
                context.setLineDash([]);
                for(let i = 0; i < lastStep.simplex.GetVertices().length; ++i)
                {
                    let ve = lastStep.simplex.GetVertices()[i];
                    let pos = coord.GetCanvasPosByCoord(ve.coord);
                    context.lineWidth = 0;
                    context.moveTo(pos.x, pos.y);
                    context.beginPath();
                    context.arc(pos.x, pos.y, 6, 0, 360, false);
                    context.fill();
                    context.closePath();
                }
                context.lineWidth = 5;
                let startPos = coord.GetCanvasPosByCoord(lastStep.simplex.GetVertices()[0].coord);
                context.moveTo(startPos.x, startPos.y);
                context.beginPath();
                for(let i = 0; i < lastStep.simplex.GetVertices().length; ++i)
                {
                    let pos = coord.GetCanvasPosByCoord(lastStep.simplex.GetVertices()[i].coord);
                    context.lineTo(pos.x, pos.y);
                }
                context.stroke();
                context.fill();
                context.closePath();

                if(status == showStepStatus.AfterAnim)
                {
                    //show next support dir and degenerated point
                    let supportDirStartPos = coord.GetCanvasPosByCoord(lastStep.degenerated_0_Simplex.coord);
                    let supportDirEndPos = coord.GetCanvasPosByCoord(lastStep.degenerated_0_Simplex.coord.Add(lastStep.degenerated_0_Simplex.coord.Mul(-1).Normalize().Mul(3)));
                    drawArrow(context, supportDirStartPos, supportDirEndPos, 10, 2, 'green');
                }else{
                    //show current support dir
                    let supportDirStartPos = coord.GetCanvasPosByCoord(lastStep.simplex.GetVertices()[0].coord);
                    let supportDirEndPos = coord.GetCanvasPosByCoord(lastStep.simplex.GetVertices()[0].coord.Add(lastStep.degenerated_0_Simplex.coord.Mul(-1).Normalize().Mul(3)));
                    drawArrow(context, supportDirStartPos, supportDirEndPos, 10, 2, 'green');
                }

            }


            //draw Raycast 
            let startPoint = convexAB.B.GetCenterCoord();
            let rayStartPos = coord.GetCanvasPosByCoord(startPoint);
            let rayEndPos = coord.GetCanvasPosByCoord(startPoint.Add(ray.Dir.Mul(ray.Length)));
            drawArrow(context, rayStartPos, rayEndPos, 20, 4, 'red');
        }
        framework.AddCustomDrawFunctionAfterDrawConvex(drawGJKCustom);


        let bMouseDown = false;
        let mouseDownFunc = (evt)=>{
            if(evt.button != 0)
            {
                return;
            }
            let pos = new Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return;
            }
            let startP = convexAB.B.GetCenterCoord();
            let dir = coord.Sub(startP);
            ray.Point = startP;
            ray.Dir = dir;
            ray.Length = dir.magnitude;
            bMouseDown = true;
        };
        let mouseMoveFunc = (evt)=>{
            if(evt.button != 0 || !bMouseDown)
            {
                return;
            }
            let pos = new Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return;
            }
            let startP = convexAB.B.GetCenterCoord();
            let dir = coord.Sub(startP);
            ray.Point = startP;
            ray.Dir = dir;
            ray.Length = dir.magnitude;
        };

        let mouseUpFunc = (evt)=>{
            if(evt.button != 0)
            {
                return;
            }
            bMouseDown = false;
        };

        let AnimUpdate = function(deltaMs : number)
        {
            if(showStepStatus.Anim != status)
            {
                return;
            }
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                return;
            }
            let distance = 1 * deltaMs / 1000;
            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;

            let lastDistance = lastStep.currentAnimLength;
            lastStep.currentAnimLength = Math.min(distance + lastStep.currentAnimLength, lastStep.minLength);
            if(lastStep.currentAnimLength == lastStep.minLength)
            {
                status = showStepStatus.AfterAnim;
            }
            distance = lastStep.currentAnimLength - lastDistance;
            //this may not be such accurate, and brings accumulated inaccuracy
            let offset = ray.Dir.Mul(distance);
            lastStep.simplex.Translate(offset);
            convexAB.B.Translate(offset);
        }

        

        clearBtn.onclick = (evt)=>{
            stepStack = [];
            ray = null;
            canvas.removeEventListener('mousedown', mouseDownFunc);
            canvas.removeEventListener('mouseup', mouseUpFunc);
            canvas.removeEventListener('mousemove', mouseMoveFunc);
            clearInterval(animUpdateIntervalHandle);
            animUpdateIntervalHandle = -1;
            EnableDraggingConvexObj();
            status = showStepStatus.None;
        };

        undoBtn.onclick = (evt)=>{
            stepStack.pop();
            status = showStepStatus.BeforeAnim;
        }


        stepBtn.onclick = (evt)=>{
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                alert("You must have 2 convex objects to do the test")
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;

            if(null == ray)
            {
                DisableDraggingConvexObj();
                status = showStepStatus.None;
                //step 1. configure the ray direction
                ray = new Raycast(convexB.GetCenterCoord(), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()).magnitude);
                canvas.addEventListener('mousedown', mouseDownFunc);
                canvas.addEventListener('mouseup', mouseUpFunc);
                canvas.addEventListener('mousemove', mouseMoveFunc);
                let lastTime = Date.now();
                animUpdateIntervalHandle = setInterval(()=>{
                    let currentTime = Date.now();
                    AnimUpdate(currentTime - lastTime);
                    lastTime = currentTime;
                }, 16);
                return;
            }else{
                canvas.removeEventListener('mousedown', mouseDownFunc);
                canvas.removeEventListener('mouseup', mouseUpFunc);
                canvas.removeEventListener('mousemove', mouseMoveFunc);
            }

            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;

            if(status == showStepStatus.None || status == showStepStatus.AfterAnim)
            {
                //show nextStep
                let stepResult = GJKRaycastStep(convexA, convexB, ray, lastStep);
                stepStack.push(stepResult);
                status = showStepStatus.BeforeAnim;
            }else if(status == showStepStatus.BeforeAnim)
            {
                status = lastStep.minLength > 0 ? showStepStatus.Anim : showStepStatus.AfterAnim;
            }else if(status == showStepStatus.Anim)
            {
                let leftDistance = lastStep.minLength - lastStep.currentAnimLength;
                if(leftDistance > 0)
                {
                    let offset = ray.Dir.Mul(leftDistance);
                    convexB.Translate(offset);
                    lastStep.simplex.Translate(offset);
                }
                status = showStepStatus.AfterAnim;
            }
        }
    }
}
module GJKTutorial
{
    enum showStepStatus
    {
        None,
        BeforeAnim,
        Anim,
        AnimEnd,
        AfterAnim
    };

    export function InitShowCase_DrawGJKRaycastStep(framework : Framework, canvas:HTMLCanvasElement, stepBtn:HTMLElement, undoBtn:HTMLElement, clearBtn:HTMLElement, runtimeBtn : HTMLElement) : void
    {
        let stepStack : GJKRaycastStepResult[] = [];
        let ray:Raycast = null;
        let animUpdateIntervalHandle : number = -1;
        let status = showStepStatus.None;

        //Draw
        let drawGJKStepCustom = function(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
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
                let simplexToDraw = status == showStepStatus.AfterAnim ? lastStep.degeneratedSimplex : lastStep.simplex;
                for(let i = 0; i < simplexToDraw.GetVertices().length; ++i)
                {
                    let ve = simplexToDraw.GetVertices()[i];
                    let pos = coord.GetCanvasPosByCoord(ve.coord);
                    context.lineWidth = 0;
                    context.moveTo(pos.x, pos.y);
                    context.beginPath();
                    context.arc(pos.x, pos.y, 6, 0, 360, false);
                    context.fill();
                    context.closePath();
                }
                context.lineWidth = 5;
                let startPos = coord.GetCanvasPosByCoord(simplexToDraw.GetVertices()[0].coord);
                context.moveTo(startPos.x, startPos.y);
                context.beginPath();
                for(let i = 0; i < simplexToDraw.GetVertices().length; ++i)
                {
                    let pos = coord.GetCanvasPosByCoord(simplexToDraw.GetVertices()[i].coord);
                    context.lineTo(pos.x, pos.y);
                }
                context.stroke();
                context.fill();
                context.closePath();

                let supportDirStartCoord : Vec2 = null;
                let supportDirEndCoord : Vec2 = null;
                if(status == showStepStatus.AfterAnim)
                {
                    //show next support dir and degenerated point
                    supportDirStartCoord = lastStep.closestPointToOriginAfterMoving;
                    supportDirEndCoord = new Vec2();
                }else{
                    //show current support dir
                    supportDirStartCoord = lastStep.simplex.GetVertices()[lastStep.simplex.GetVertices().length - 1].coord;
                    let suportDirAxisDir = new Vec2(-lastStep.supportDir.y, lastStep.supportDir.x).Normalize();
                    let Axis0 = suportDirAxisDir.Normalize().Mul(1000);
                    let Axis1 = suportDirAxisDir.Normalize().Mul(-1000);
                    supportDirEndCoord = ClosestPointOnSegment(supportDirStartCoord, Axis0, Axis1);
                }
                drawArrow(context, coord.GetCanvasPosByCoord(supportDirStartCoord), coord.GetCanvasPosByCoord(supportDirEndCoord), 0, 2, 'green');

                let supportDir = supportDirStartCoord.Sub(supportDirEndCoord);
                let suportDirAxisDir = new Vec2(-supportDir.y, supportDir.x);
                let axisStartCoord = suportDirAxisDir.Normalize().Mul(10);
                let axisEndCoord = suportDirAxisDir.Normalize().Mul(-10);
                let axisStartPoint = coord.GetCanvasPosByCoord(axisStartCoord);
                let axisEndPoint = coord.GetCanvasPosByCoord(axisEndCoord);
                context.setLineDash([3, 3]);
                context.lineWidth = 2;
                context.strokeStyle = '#22ef22aa';
                context.moveTo(axisStartPoint.x, axisStartPoint.y);
                context.lineTo(axisStartPoint.x, axisStartPoint.y);
                context.lineTo(axisEndPoint.x, axisEndPoint.y);
                context.stroke();
            }


            //draw Raycast 
            let startPoint = convexAB.B.GetCenterCoord();
            let rayStartPos = coord.GetCanvasPosByCoord(startPoint);
            let rayEndPos = coord.GetCanvasPosByCoord(startPoint.Add(ray.Dir.Mul(ray.Length)));
            drawArrow(context, rayStartPos, rayEndPos, 20, 4, 'red');
        }

        let drawGJKRuntimeCustom = function(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
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

            let runtimeHit = GJKRaycast(convexAB.A, convexAB.B, ray);
            let distance = runtimeHit ? runtimeHit.distance : ray.Length;
            let moveVector = ray.Dir.Mul(distance);

            //draw Target ConvexB
            let startPos = coord.GetCanvasPosByCoord(convexAB.B.GetVertices()[0].coord.Add(moveVector));
            context.lineWidth = 1;
            context.setLineDash([4, 4]);
            context.strokeStyle = '#444444aa';
            context.fillStyle = '#66444444';
            context.moveTo(startPos.x, startPos.y);
            context.beginPath();
            for(let i = 0; i < convexAB.B.GetVertices().length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(convexAB.B.GetVertices()[i].coord.Add(moveVector));
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            context.fill();
            context.closePath();
            context.setLineDash([]);

            //draw Normal
            if(runtimeHit)
            {
                let normalStartPoint = runtimeHit.pointA;
                let normalEndPos = runtimeHit.normalA.Add(normalStartPoint);
                drawArrow(context, coord.GetCanvasPosByCoord(normalStartPoint), coord.GetCanvasPosByCoord(normalEndPos), 6, 2, 'red');
            }

            //draw Raycast 
            let startPoint = convexAB.B.GetCenterCoord();
            let rayStartPos = coord.GetCanvasPosByCoord(startPoint);
            let rayEndPos = coord.GetCanvasPosByCoord(startPoint.Add(ray.Dir.Mul(ray.Length)));
            drawArrow(context, rayStartPos, rayEndPos, 20, 4, 'red');
        }


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
                status = showStepStatus.AnimEnd;
            }
            distance = lastStep.currentAnimLength - lastDistance;
            //this may not be such accurate, and brings accumulated inaccuracy
            let offset = ray.Dir.Mul(distance);
            lastStep.simplex.Translate(offset.Mul(-1));
            convexAB.B.Translate(offset);
        }

        

        let stepClear = function(evt)
        {
            stepStack = [];
            ray = null;
            canvas.removeEventListener('mousedown', mouseDownFunc);
            canvas.removeEventListener('mouseup', mouseUpFunc);
            canvas.removeEventListener('mousemove', mouseMoveFunc);
            clearInterval(animUpdateIntervalHandle);
            animUpdateIntervalHandle = -1;
            EnableDraggingConvexObj();
            status = showStepStatus.None;
            framework.RmvCustomDrawFunctionAfterDrawConvex(drawGJKStepCustom);
        }

        let stepUndo = function(evt)
        {
            stepStack.pop();
            status = stepStack.length > 0 ? showStepStatus.BeforeAnim : showStepStatus.None;
        }

        let stepStart = function(evt)
        {
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                alert("You must have 2 convex objects to do the test")
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;

            runtimeEnd(null);
            if(null == ray)
            {
                DisableDraggingConvexObj();
                status = showStepStatus.None;
                //step 1. configure the ray direction
                ray = new Raycast(convexB.GetCenterCoord(), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()).magnitude);
                framework.AddCustomDrawFunctionAfterDrawConvex(drawGJKStepCustom);
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
                    lastStep.simplex.Translate(offset.Mul(-1));
                }
                status = showStepStatus.AnimEnd;
            }else if(status == showStepStatus.AnimEnd)
            {
                status = showStepStatus.AfterAnim;
            }
        }


        let runtimeRunning = false;
        let runtimeStart = function(evt)
        {
            let convexAB = framework.GetConvexAB();
            if(!convexAB)
            {
                alert("You must have 2 convex objects to do the test")
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;
            if(runtimeRunning)
            {
                return;
            }
            runtimeRunning = true;
            stepClear(null);
            ray = new Raycast(convexB.GetCenterCoord(), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()).magnitude);
            framework.AddCustomDrawFunctionAfterDrawConvex(drawGJKRuntimeCustom);
            canvas.addEventListener('mousedown', mouseDownFunc);
            canvas.addEventListener('mouseup', mouseUpFunc);
            canvas.addEventListener('mousemove', mouseMoveFunc);
        }

        let runtimeEnd = function(evt)
        {
            if(!runtimeRunning)
            {
                return;
            }
            runtimeRunning = false;
            framework.RmvCustomDrawFunctionAfterDrawConvex(drawGJKRuntimeCustom);
            canvas.removeEventListener('mousedown', mouseDownFunc);
            canvas.removeEventListener('mouseup', mouseUpFunc);
            canvas.removeEventListener('mousemove', mouseMoveFunc);
        }


        clearBtn.onclick = stepClear;
        undoBtn.onclick = stepUndo;
        stepBtn.onclick = stepStart;

        runtimeBtn.onclick = (evt)=>{
            if(runtimeRunning)
            {
                runtimeEnd(evt);
            }else{
                runtimeStart(evt);
            }
        }
    }
}
var GJKTutorial;
(function (GJKTutorial) {
    let showStepStatus;
    (function (showStepStatus) {
        showStepStatus[showStepStatus["None"] = 0] = "None";
        showStepStatus[showStepStatus["BeforeAnim"] = 1] = "BeforeAnim";
        showStepStatus[showStepStatus["Anim"] = 2] = "Anim";
        showStepStatus[showStepStatus["AfterAnim"] = 3] = "AfterAnim";
    })(showStepStatus || (showStepStatus = {}));
    ;
    function InitShowCase_DrawGJKRaycastStep(framework, canvas, stepBtn, undoBtn, clearBtn) {
        let stepStack = [];
        let ray = null;
        let animUpdateIntervalHandle = -1;
        let status = showStepStatus.None;
        //Draw
        let drawGJKCustom = function (deltaMs, coord, context) {
            if (ray == null) {
                return;
            }
            let convexAB = framework.GetConvexAB();
            if (!convexAB) {
                return;
            }
            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            if (lastStep) {
                //draw Simplex
                context.strokeStyle = '#ff00ffAA';
                context.fillStyle = '#ff00ffAA';
                context.setLineDash([]);
                for (let i = 0; i < lastStep.simplex.GetVertices().length; ++i) {
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
                for (let i = 0; i < lastStep.simplex.GetVertices().length; ++i) {
                    let pos = coord.GetCanvasPosByCoord(lastStep.simplex.GetVertices()[i].coord);
                    context.lineTo(pos.x, pos.y);
                }
                context.stroke();
                context.fill();
                context.closePath();
                let supportDirStartCoord = null;
                let supportDirEndPos = coord.GetCanvasPosByCoord(new GJKTutorial.Vec2());
                ;
                if (status == showStepStatus.AfterAnim) {
                    //show next support dir and degenerated point
                    supportDirStartCoord = lastStep.degenerated_0_Simplex.coord;
                    supportDirEndPos = coord.GetCanvasPosByCoord(new GJKTutorial.Vec2());
                }
                else {
                    //show current support dir
                    supportDirStartCoord = lastStep.simplex.GetVertices()[0].coord;
                    supportDirEndPos = coord.GetCanvasPosByCoord(new GJKTutorial.Vec2());
                }
                GJKTutorial.drawArrow(context, coord.GetCanvasPosByCoord(supportDirStartCoord), supportDirEndPos, 10, 2, 'green');
                let suportDirAxisDir = new GJKTutorial.Vec2(-supportDirStartCoord.y, supportDirStartCoord.x);
                let axisStartCoord = suportDirAxisDir.Normalize().Mul(10);
                let axisEndCoord = suportDirAxisDir.Normalize().Mul(-10);
                let axisStartPoint = coord.GetCanvasPosByCoord(axisStartCoord);
                let axisEndPoint = coord.GetCanvasPosByCoord(axisEndCoord);
                context.setLineDash([3, 3]);
                context.lineWidth = 2.5;
                context.strokeStyle = '#22ef22aa';
                context.moveTo(axisStartPoint.x, axisStartPoint.y);
                context.lineTo(axisStartPoint.x, axisStartPoint.y);
                context.beginPath();
                context.lineTo(axisEndPoint.x, axisEndPoint.y);
                context.stroke();
                context.closePath();
            }
            //draw Raycast 
            let startPoint = convexAB.B.GetCenterCoord();
            let rayStartPos = coord.GetCanvasPosByCoord(startPoint);
            let rayEndPos = coord.GetCanvasPosByCoord(startPoint.Add(ray.Dir.Mul(ray.Length)));
            GJKTutorial.drawArrow(context, rayStartPos, rayEndPos, 20, 4, 'red');
        };
        framework.AddCustomDrawFunctionAfterDrawConvex(drawGJKCustom);
        let bMouseDown = false;
        let mouseDownFunc = (evt) => {
            if (evt.button != 0) {
                return;
            }
            let pos = new GJKTutorial.Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            let convexAB = framework.GetConvexAB();
            if (!convexAB) {
                return;
            }
            let startP = convexAB.B.GetCenterCoord();
            let dir = coord.Sub(startP);
            ray.Point = startP;
            ray.Dir = dir;
            ray.Length = dir.magnitude;
            bMouseDown = true;
        };
        let mouseMoveFunc = (evt) => {
            if (evt.button != 0 || !bMouseDown) {
                return;
            }
            let pos = new GJKTutorial.Vec2(evt.offsetX, evt.offsetY);
            let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
            let convexAB = framework.GetConvexAB();
            if (!convexAB) {
                return;
            }
            let startP = convexAB.B.GetCenterCoord();
            let dir = coord.Sub(startP);
            ray.Point = startP;
            ray.Dir = dir;
            ray.Length = dir.magnitude;
        };
        let mouseUpFunc = (evt) => {
            if (evt.button != 0) {
                return;
            }
            bMouseDown = false;
        };
        let AnimUpdate = function (deltaMs) {
            if (showStepStatus.Anim != status) {
                return;
            }
            let convexAB = framework.GetConvexAB();
            if (!convexAB) {
                return;
            }
            let distance = 1 * deltaMs / 1000;
            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            let lastDistance = lastStep.currentAnimLength;
            lastStep.currentAnimLength = Math.min(distance + lastStep.currentAnimLength, lastStep.minLength);
            if (lastStep.currentAnimLength == lastStep.minLength) {
                status = showStepStatus.AfterAnim;
            }
            distance = lastStep.currentAnimLength - lastDistance;
            //this may not be such accurate, and brings accumulated inaccuracy
            let offset = ray.Dir.Mul(distance);
            lastStep.simplex.Translate(offset.Mul(-1));
            convexAB.B.Translate(offset);
        };
        clearBtn.onclick = (evt) => {
            stepStack = [];
            ray = null;
            canvas.removeEventListener('mousedown', mouseDownFunc);
            canvas.removeEventListener('mouseup', mouseUpFunc);
            canvas.removeEventListener('mousemove', mouseMoveFunc);
            clearInterval(animUpdateIntervalHandle);
            animUpdateIntervalHandle = -1;
            GJKTutorial.EnableDraggingConvexObj();
            status = showStepStatus.None;
        };
        undoBtn.onclick = (evt) => {
            stepStack.pop();
            status = stepStack.length > 0 ? showStepStatus.BeforeAnim : showStepStatus.None;
        };
        stepBtn.onclick = (evt) => {
            let convexAB = framework.GetConvexAB();
            if (!convexAB) {
                alert("You must have 2 convex objects to do the test");
                return null;
            }
            let convexA = convexAB.A;
            let convexB = convexAB.B;
            if (null == ray) {
                GJKTutorial.DisableDraggingConvexObj();
                status = showStepStatus.None;
                //step 1. configure the ray direction
                ray = new GJKTutorial.Raycast(convexB.GetCenterCoord(), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()), convexA.GetCenterCoord().Sub(convexB.GetCenterCoord()).magnitude);
                canvas.addEventListener('mousedown', mouseDownFunc);
                canvas.addEventListener('mouseup', mouseUpFunc);
                canvas.addEventListener('mousemove', mouseMoveFunc);
                let lastTime = Date.now();
                animUpdateIntervalHandle = setInterval(() => {
                    let currentTime = Date.now();
                    AnimUpdate(currentTime - lastTime);
                    lastTime = currentTime;
                }, 16);
                return;
            }
            else {
                canvas.removeEventListener('mousedown', mouseDownFunc);
                canvas.removeEventListener('mouseup', mouseUpFunc);
                canvas.removeEventListener('mousemove', mouseMoveFunc);
            }
            let lastStep = stepStack.length > 0 ? stepStack[stepStack.length - 1] : null;
            if (status == showStepStatus.None || status == showStepStatus.AfterAnim) {
                //show nextStep
                let stepResult = GJKTutorial.GJKRaycastStep(convexA, convexB, ray, lastStep);
                stepStack.push(stepResult);
                status = showStepStatus.BeforeAnim;
            }
            else if (status == showStepStatus.BeforeAnim) {
                status = lastStep.minLength > 0 ? showStepStatus.Anim : showStepStatus.AfterAnim;
            }
            else if (status == showStepStatus.Anim) {
                let leftDistance = lastStep.minLength - lastStep.currentAnimLength;
                if (leftDistance > 0) {
                    let offset = ray.Dir.Mul(leftDistance);
                    convexB.Translate(offset);
                    lastStep.simplex.Translate(offset.Mul(-1));
                }
                status = showStepStatus.AfterAnim;
            }
        };
    }
    GJKTutorial.InitShowCase_DrawGJKRaycastStep = InitShowCase_DrawGJKRaycastStep;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=ShowCase_GJKRaycast.js.map
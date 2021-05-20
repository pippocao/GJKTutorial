//This is for draw custom convex on the coordinate

module GJKTutorial
{

    function GetAvailableCoordinateName(framework : Framework, isSmallCase : boolean, excludedNames : string[]) : string
    {
        let currentCharCodesSet = {};
        for(let i = 0; i < framework.GetConvexObjsCount(); ++i)
        {
            let convex = framework.GetConvex(i);
            for(let j = 0; j < convex.GetVertices().length; ++j)
            {
                let name = convex.GetVertices()[j].name;
                if(!name)
                {
                    continue;
                }
                name = isSmallCase ? name.toLowerCase() : name.toUpperCase();
                currentCharCodesSet[name] = true;
            }
        }
        if(excludedNames)
        {
            excludedNames.forEach((name : string)=>{
                currentCharCodesSet[isSmallCase ? name.toLowerCase() : name.toUpperCase()] = true;
            })
        }

        let code = 0;  //custom code of latter 'a';
        while(true)
        {
            let name = DecodeCustomCharCode(code, isSmallCase);
            if(!currentCharCodesSet[name])
            {
                return name;
            }
            ++code;
        }
        return null;  //wtf ? This should not happen;
    }

    export function InitShowCase_DrawCustomConvex(framework : Framework, canvas:HTMLCanvasElement, buttonClear:HTMLElement, buttonBeginAdd:HTMLElement, buttonFinishAdd:HTMLElement, buttonCancel:HTMLElement) : void
    {

        buttonClear.onclick = function()
        {
            while(framework.GetConvexObjsCount() > 0)
            {
                framework.RemoveConvex(0);
            }
        };

        let penddingVertices : Vertex[] = [];

        let customDrawPenddingVertex = (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>{
            if(penddingVertices.length == 0)
            {
                return;
            }
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            let startPos = coord.GetCanvasPosByCoord(penddingVertices[0].coord);
            for(let i = 0; i < penddingVertices.length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(penddingVertices[i].coord);
                context.beginPath();
                context.arc(pos.x, pos.y, 10, 0, 2 * Math.PI, false);
                context.fillStyle = 'black';
                context.fill();
                context.closePath();
                context.fillText(penddingVertices[i].name, pos.x, pos.y);
            }
            context.moveTo(startPos.x, startPos.y);
            
            context.beginPath();
            for(let i = 0; i < penddingVertices.length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(penddingVertices[i].coord);
                context.lineWidth = 1;
                context.strokeStyle = 'black';
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            context.closePath();
        };


        let canvasClickListener = (evt : MouseEvent)=>{
            if(evt.button == 0)
            {
                //Left Mouse Button
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
                let excludedNames : string[] = [];
                penddingVertices.forEach((vertex : Vertex)=>{
                    excludedNames.push(vertex.name);
                });
                let name = GetAvailableCoordinateName(framework, true, excludedNames);
                let vertex = new Vertex(coord, name);
                vertex.drawName = false;
                penddingVertices.push(vertex);
            }
        };

        let canvasRightClickListener = function(evt){
            evt.preventDefault();
            penddingVertices.pop();
        };

        buttonBeginAdd.onclick = function()
        {
            if(framework.GetConvexObjsCount() >= 2)
            {
                alert("More than 2 Convex Object is not allowed, please clear the convex objects first");
                return;
            }

            buttonCancel.removeAttribute("disabled");
            buttonFinishAdd.removeAttribute("disabled");
            buttonBeginAdd.setAttribute("disabled", "true") ;

            canvas.addEventListener('click', canvasClickListener);
            //RightMouseButton
            canvas.addEventListener('contextmenu', canvasRightClickListener);

            framework.AddCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        }
        buttonFinishAdd.onclick = function()
        {
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true") ;
            buttonFinishAdd.setAttribute("disabled", "true") ;

            let convex = new Convex();
            for(let i = 0; i < penddingVertices.length; ++i)
            {
                let vertex = penddingVertices[i];
                vertex.drawName = true;
                convex.AddVertex(vertex);
            }
            convex.name = GetAvailableCoordinateName(framework, false, null);
            convex.ReOrder();
            if(convex.IsConvex())
            {
                framework.AddConvex(convex);
            }else{
                window.alert("Only Convex Object are allowed!");
            }
            

            penddingVertices = [];
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        }
        buttonCancel.onclick = function()
        {
            buttonBeginAdd.removeAttribute("disabled");
            buttonCancel.setAttribute("disabled", "true") ;
            buttonFinishAdd.setAttribute("disabled", "true") ;
            canvas.removeEventListener('click', canvasClickListener);
            canvas.removeEventListener('contextmenu', canvasRightClickListener);
            penddingVertices = [];
            framework.RmvCustomDrawFunctionAfterDrawConvex(customDrawPenddingVertex);
        }
    }
}
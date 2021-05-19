module GJKTutorial
{
    export let draggingConvexObj : Convex = null;
    
    window.onload = function()
    {
        let canvas = document.getElementById('canvas') as
                 HTMLCanvasElement;
        let framework = new Framework(canvas);
    
        /////////////////////Default Convex Objects////////////////////
        let conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(6, 8), "a"));
        conv.AddVertex(new Vertex(new Vec2(5, 2), "b"));
        conv.AddVertex(new Vertex(new Vec2(1, 6), "c"));
        conv.name = "A";
        framework.AddConvex(conv);
    
        
        conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(6, 4), "d"));
        conv.AddVertex(new Vertex(new Vec2(2, 2), "e"));
        conv.AddVertex(new Vertex(new Vec2(5, -2), "f"));
        conv.name = "B";
        framework.AddConvex(conv);
        /////////////////////Default Convex Objects////////////////////

        /////////////////////Custom Convex Functions////////////////////
        let buttonClear = document.getElementById('ClearAllConvex');
        let buttonBeginAdd = document.getElementById('BeginAddNewConvex');
        let buttonFinishAdd = document.getElementById('FinishAddNewConvex');
        let buttonCancel = document.getElementById('CancelAddNewConvex');

        InitShowCase_DrawCustomConvex(framework, canvas, buttonClear, buttonBeginAdd, buttonFinishAdd, buttonCancel);
        /////////////////////Custom Convex Functions////////////////////



        /////////////////////Full Minkowski Difference Preview////////////////////
        let buttonToggleMinkowskiDiff = document.getElementById("MinkowskiDiffToggle");
        InitShowCase_MinkowskiDiff(framework, buttonToggleMinkowskiDiff);
        /////////////////////Full Minkowski Difference Preview////////////////////


        //////////////////////GJK Step Demonstration////////////////////////////
        let buttonGJKStep = document.getElementById("GJKStep");
        let buttonGJKUndo = document.getElementById("GJKUndoStep");
        let buttonGJKClear = document.getElementById("GJKClear");
        InitShowCase_DrawGJKStep(framework, canvas, buttonGJKStep, buttonGJKUndo, buttonGJKClear);
        //////////////////////GJK Step Demonstration////////////////////////////

        
        //////////////////////EPA Demonstration////////////////////////////
        let buttonEPAStep = document.getElementById("EPAStep");
        let buttonEPAUndo = document.getElementById("EPAUndoStep");
        let buttonEPAClear = document.getElementById("EPAClear");
        let buttonEPAPushOutToggle = document.getElementById("EPAPushOutToggle");
        InitShowCase_DrawEPAStep(framework, canvas, buttonEPAStep, buttonEPAUndo, buttonEPAClear, buttonEPAPushOutToggle);
        //////////////////////GJK Step Demonstration////////////////////////////


        /////////////////////////Drag Convex///////////////////////////////////
        {
            let bDrag = false;
            let lastCood : Vec2 = null;
            canvas.addEventListener('mousedown', (evt)=>{
                if(evt.button != 1)
                {
                    return;
                }
                event.preventDefault();
                bDrag = true;

                let pos = new Vec2(evt.offsetX, evt.offsetY);
                lastCood = framework.GetCoordinate().GetCoordByCanvasPos(pos);
                for(let i = 0; i < framework.GetConvexObjsCount(); ++i)
                {
                    let candidiateConvex = framework.GetConvex(i);
                    if(candidiateConvex.IsPointInConvex(lastCood))
                    {
                        draggingConvexObj = candidiateConvex;
                        break;
                    }
                }
            });
    
            canvas.addEventListener('mousemove', (evt)=>{
                if(!bDrag || !draggingConvexObj)
                {
                    return;
                }
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let coord = framework.GetCoordinate().GetCoordByCanvasPos(pos);
                draggingConvexObj.Translate(coord.Sub(lastCood));
                lastCood = coord;
            });
    
            canvas.addEventListener('mouseup', (evt)=>{
                if(evt.button != 1)
                {
                    return;
                }
                event.preventDefault();
                bDrag = false;
                draggingConvexObj = null;
            });
        }
        //////////////////////////////////////////////////////////////////////
    };
}
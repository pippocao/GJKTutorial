module GJKTutorial
{

    export class Framework {
        private canvas : HTMLCanvasElement;
        private context : CanvasRenderingContext2D;
        private coord : Coordinate;
        private convexObjs : Convex[] = [];
        private convexCounter : number = 0;
        private readonly convexFillColors : string[] = ['#8e232244', '#2387ff44'];
        private customDrawsBeforeDrawConvex : ((deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void) [] = [];
        private customDrawsAfterDrawConvex : ((deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void) [] = [];

        constructor(inCanvas : HTMLCanvasElement)
        {
            this.canvas = inCanvas;
            this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
            this.coord = new Coordinate(this.canvas);
            let lastUpdateTime = Date.now();
            setInterval(()=>{
                let currentTime = Date.now();
                this.update(currentTime - lastUpdateTime);
                lastUpdateTime = currentTime;
            }, 16);
        }


        public update(deltaMs : number) : void
        {
            this.ClearCanvas();
            this.DrawCoordinate(deltaMs);
            this.customDrawsBeforeDrawConvex.forEach(element => {
                element(deltaMs, this.coord, this.context);
            });
            this.DrawConvexObjs(deltaMs);
            this.customDrawsAfterDrawConvex.forEach(element => {
                element(deltaMs, this.coord, this.context);
            });

            if(this.convexObjs.length == 2)
            {
                if(GJKTest(this.convexObjs[0], this.convexObjs[1]) != null)
                {
                    this.context.fillRect(0, 0, 20, 20);
                }
            }
        }

        public AddCustomDrawFunctionBeforeDrawConvex(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            this.customDrawsBeforeDrawConvex.push(func);
        }

        public RmvCustomDrawFunctionBeforeDrawConvex(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            let index = this.customDrawsBeforeDrawConvex.indexOf(func);
            if(index >= 0)
            {
                this.customDrawsBeforeDrawConvex.splice(index, 1);
            }
        }

        public AddCustomDrawFunctionAfterDrawConvex(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            this.customDrawsAfterDrawConvex.push(func);
        }

        public RmvCustomDrawFunctionAfterDrawConvex(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            let index = this.customDrawsAfterDrawConvex.indexOf(func);
            if(index >= 0)
            {
                this.customDrawsAfterDrawConvex.splice(index, 1);
            }
        }

        public GetCoordinate() : Coordinate
        {
            return this.coord;
        }

        private ClearCanvas() : void
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }


        private DrawCoordinate(deltaMs : number) : void
        {
            this.coord.Draw(deltaMs, this.context);
        }

        private DrawConvexObjs(deltaMs : number) : void
        {
            for(let i = 0; i < this.convexObjs.length; ++i)
            {
                this.convexObjs[i].Draw(deltaMs, this.coord, this.context);
            }
        }

        public GetConvexObjsCount() : number
        {
            return this.convexObjs.length;
        }

        public GetConvex(index : number) : Convex
        {
            return this.convexObjs[index];
        }

        //the maximum number of convex objects is 2;
        public AddConvex(convex : Convex) : void
        {
            this.convexObjs.push(convex);
            convex.fillColor = this.convexFillColors[this.convexCounter % this.convexFillColors.length];
            ++this.convexCounter;
            if(this.convexObjs.length > 2)
            {
                this.convexObjs.splice(0, 1);
            }
        }

        public RemoveConvex(convex : Convex | number) : void
        {
            if(convex instanceof Convex)
            {
                let index = this.convexObjs.indexOf(convex);
                if(index >= 0)
                {
                    this.convexObjs.splice(index, 1);
                }
            }else{
                this.convexObjs.splice(convex, 1);
            }
        }
    }


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


        /////////////////////////Drag Convex///////////////////////////////////
        {
            let bDrag = false;
            let draggingConvexObj : Convex = null;
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
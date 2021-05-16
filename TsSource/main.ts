module GJKTutorial
{

    export class Framework {
        private canvas : HTMLCanvasElement;
        private context : CanvasRenderingContext2D;
        private coord : Coordinate;
        private convexObjs : Convex[] = [];
        private convexCounter : number = 0;
        private readonly convexFillColors : string[] = ['#8e232244', '#2387ff44'];
        private customDrawBeforeDrawConvex : (coord : Coordinate, context : CanvasRenderingContext2D)=>void = null;
        private customDrawAfterDrawConvex : (coord : Coordinate, context : CanvasRenderingContext2D)=>void = null;

        constructor(inCanvas : HTMLCanvasElement)
        {
            this.canvas = inCanvas;
            this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
            this.coord = new Coordinate(this.canvas);
            setInterval(()=>{this.update()}, 16);
        }


        public update() : void
        {
            this.ClearCanvas();
            this.DrawCoordinate();
            if(this.customDrawBeforeDrawConvex)
            {
                this.customDrawBeforeDrawConvex(this.coord, this.context);
            }
            this.DrawConvexObjs();
            if(this.customDrawAfterDrawConvex)
            {
                this.customDrawAfterDrawConvex(this.coord, this.context);
            }
        }

        public SetCustomDrawFunctionBeforeDrawConvex(func : (coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            this.customDrawBeforeDrawConvex = func;
        }


        public SetCustomDrawFunctionAfterDrawConvex(func : (coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            this.customDrawAfterDrawConvex = func;
        }

        public GetCoordinate() : Coordinate
        {
            return this.coord;
        }

        private ClearCanvas() : void
        {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }


        private DrawCoordinate() : void
        {
            this.coord.Draw(this.context);
        }

        private DrawConvexObjs() : void
        {
            for(let i = 0; i < this.convexObjs.length; ++i)
            {
                this.convexObjs[i].Draw(this.coord, this.context);
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
    
        let conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(3, 4), "a"));
        conv.AddVertex(new Vertex(new Vec2(5, 2), "b"));
        conv.AddVertex(new Vertex(new Vec2(-5, -4), "c"));
        conv.AddVertex(new Vertex(new Vec2(-8, -2), "d"));
        conv.name = "A";
        framework.AddConvex(conv);
    
        
        conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(6, 4), "e"));
        conv.AddVertex(new Vertex(new Vec2(2, 2), "f"));
        conv.AddVertex(new Vertex(new Vec2(-5, -4), "g"));
        conv.name = "B";
        framework.AddConvex(conv);

        let buttonClear = document.getElementById('ClearAllConvex');
        let buttonBeginAdd = document.getElementById('BeginAddNewConvex');
        let buttonFinishAdd = document.getElementById('FinishAddNewConvex');
        let buttonCancel = document.getElementById('CancelAddNewConvex');

        InitDrawCustomConvex(framework, canvas, buttonClear, buttonBeginAdd, buttonFinishAdd, buttonCancel);
    };
}
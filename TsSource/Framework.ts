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
        private customDrawsFinal : ((deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void) [] = [];
        private leftMouseDown : (evt : MouseEvent)=>void = null;
        private leftMouseMove : (evt : MouseEvent)=>void = null;
        private leftMouseUp : (evt : MouseEvent)=>void = null;


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

            let isLeftMouseDown = false;
            this.canvas.addEventListener('mousedown', (evt : MouseEvent)=>{
                if(this.leftMouseDown && evt.button == 0)
                {
                    isLeftMouseDown = true;
                    this.leftMouseDown(evt);
                }
            });
            this.canvas.addEventListener('mouseup', (evt : MouseEvent)=>{
                if(this.leftMouseUp && evt.button == 0)
                {
                    isLeftMouseDown = false;
                    this.leftMouseUp(evt);
                }
            });
            this.canvas.addEventListener('mousemove', (evt : MouseEvent)=>{
                if(this.leftMouseMove && isLeftMouseDown)
                {
                    this.leftMouseMove(evt);
                }
            });
            this.canvas.addEventListener("wheel", (evt : WheelEvent)=>{
                this.coord.coordXMax += evt.deltaY / 100;
                this.coord.coordYMax += evt.deltaY / 100;
                evt.preventDefault();
            });
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
            this.customDrawsFinal.forEach(element => {
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

        public RegisterLeftMouseEvent(mouseDown : (evt : MouseEvent)=>void , mouseMove : (evt : MouseEvent)=>void , mouseUp:(evt : MouseEvent)=>void )
        {
            this.leftMouseDown = mouseDown;
            this.leftMouseMove = mouseMove;
            this.leftMouseUp = mouseUp;
        }

        public UnRegisterLeftMouseEvent(mouseDown : (evt : MouseEvent)=>void , mouseMove : (evt : MouseEvent)=>void , mouseUp:(evt : MouseEvent)=>void )
        {
            if(this.leftMouseDown == mouseDown)
            {
                this.leftMouseDown = null;
            }
            if(this.leftMouseUp == mouseUp)
            {
                this.leftMouseUp = null;
            }
            if(this.leftMouseMove == mouseMove)
            {
                this.leftMouseMove = null;
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

        public AddCustomDrawFunctionFinal(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            this.customDrawsFinal.push(func);
        }

        public RmvCustomDrawFunctionFinal(func : (deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D)=>void)
        {
            let index = this.customDrawsFinal.indexOf(func);
            if(index >= 0)
            {
                this.customDrawsFinal.splice(index, 1);
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

        //We always use (A - B) to calculate Minkowski Difference
        public GetConvexAB() : {A : Convex, B : Convex}
        {
            if(this.convexObjs.length != 2)
            {
                return null;
            }
            let convexObjs = [this.convexObjs[0], this.convexObjs[1]];
            convexObjs.sort((a, b)=>{
                return EncodeCustomCharCode(a.name) - EncodeCustomCharCode(b.name);
            });
            return {A:convexObjs[0], B:convexObjs[1]};
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
}
module GJKTutorial
{

    class Main {
        private canvas : HTMLCanvasElement;
        private context : CanvasRenderingContext2D;
        private coord : Coordinate;
        private convexObjs : Convex[] = [];
        private readonly convexFillColors : string[] = ['#8e232244', '#2387ff44'];

        constructor()
        {
            this.canvas = document.getElementById('canvas') as
                     HTMLCanvasElement;
            this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
            this.coord = new Coordinate(this.canvas);
        }


        public update() : void
        {
            this.ClearCanvas();
            this.DrawCoordinate();
            this.DrawConvexObjs();
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
                this.context.fillStyle = this.convexFillColors[i % this.convexFillColors.length];
                this.convexObjs[i].Draw(this.coord, this.context);
            }
        }


        public AddConvex(convex : Convex) : void
        {
            this.convexObjs.push(convex);
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

    let main = new Main();

    let conv = new Convex();
    conv.AddVertex(new Vertex(new Vec2(3, 4), "A"));
    conv.AddVertex(new Vertex(new Vec2(5, 2), "B"));
    conv.AddVertex(new Vertex(new Vec2(-5, -4), "C"));

    main.AddConvex(conv);

    setInterval(()=>{main.update()}, 16);
}
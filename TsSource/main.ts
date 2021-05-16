module GJKTutorial
{

    class Main {
        private canvas : HTMLCanvasElement;
        private context : CanvasRenderingContext2D;
        private coord : Coordinate;
        private convexObjs : Convex[] = [];
        private convexCounter : number = 0;
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
                this.convexObjs[i].Draw(this.coord, this.context);
            }
        }


        public AddConvex(convex : Convex) : void
        {
            this.convexObjs.push(convex);
            convex.fillColor = this.convexFillColors[this.convexCounter % this.convexFillColors.length];
            ++this.convexCounter;
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
        let main = new Main();
    
        let conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(3, 4), "a"));
        conv.AddVertex(new Vertex(new Vec2(5, 2), "b"));
        conv.AddVertex(new Vertex(new Vec2(-5, -4), "c"));
        conv.AddVertex(new Vertex(new Vec2(-8, -2), "d"));
        conv.name = "A";
        main.AddConvex(conv);
    
        
        conv = new Convex();
        conv.AddVertex(new Vertex(new Vec2(6, 4), "e"));
        conv.AddVertex(new Vertex(new Vec2(2, 2), "f"));
        conv.AddVertex(new Vertex(new Vec2(-5, -4), "g"));
        conv.name = "B";
        main.AddConvex(conv);
    
        console.log(conv.IsConvex());
    
        setInterval(()=>{main.update()}, 16);
    };
}
module GJKTutorial
{
    export class Convex
    {
        private vertices : Vertex[] = [];
        public name : string;   //for display
        public drawName : boolean = true;  //toggle for name display;


        public AddVertex(vertex : Vertex) : void
        {
            this.vertices.push(vertex);
        }

        public RemoveVertex(index : number) : void
        {
            this.vertices.splice(index, 1);
        }

        public GetVertices() : ReadonlyArray<Vertex>
        {
            return this.vertices;
        }

        public IsConvex() : boolean
        {
            //todo
            return true;
        }

        public Draw(coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = 'black';
            for(let i = 0; i < this.vertices.length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(this.vertices[i].coord);
                if(i == 0)
                {
                    context.moveTo(pos.x, pos.y);
                }else{
                    context.lineTo(pos.x, pos.y);
                }
                this.vertices[i].Draw(coord, context);
                if(this.drawName)
                {
                    //context.fillText(this.name, pos.x, pos.y);
                }
            }
            context.stroke();
            context.closePath();
            context.fill();
        }
    }
}
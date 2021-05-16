module GJKTutorial
{
    export class Convex
    {
        private vertices : Vertex[] = [];
        public name : string;   //for display
        public drawName : boolean = true;  //toggle for name display;
        public fillColor : string = "#ffffffff";

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
            if(this.vertices.length < 3)
            {
                return false;
            }
            let lastCross = 0;
            for(let i = 0; i < this.vertices.length; ++i)
            {
                let point = this.vertices[i];
                let point_prev = this.vertices[(i - 1 + this.vertices.length) % this.vertices.length];
                let point_next = this.vertices[(i + 1) % this.vertices.length];

                let vector1 = point.coord.Sub(point_prev.coord);
                let vector2 = point_next.coord.Sub(point.coord);

                let cross = vector1.Cross(vector2);

                if(lastCross == 0)
                {
                    lastCross = cross;
                }else if(cross != 0){
                    if(cross * lastCross < 0)
                    {
                        return false;
                    }
                    lastCross = cross;
                }

            }
            return true;
        }

        public GetCenterCoord() : Vec2
        {
            let center : Vec2 = new Vec2();
            let sumWeight : number = 0;
            for(let i = 0; i < this.vertices.length; ++i)
            {
                let point = this.vertices[i];
                let point_prev = this.vertices[(i - 1 + this.vertices.length) % this.vertices.length];
                let point_next = this.vertices[(i + 1) % this.vertices.length];

                let weight = point.coord.Sub(point_prev.coord).magnitude + point.coord.Sub(point_next.coord).magnitude;
                center = center.Add(point.coord.Mul(weight));
                sumWeight += weight;
            }
            return center.Div(sumWeight);
        }

        public Draw(coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(this.vertices.length <= 0)
            {
                return;
            }
            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = 'black';
            let beginPos = coord.GetCanvasPosByCoord(this.vertices[0].coord);
            context.moveTo(beginPos.x, beginPos.y);
            for(let i = 1; i <= this.vertices.length; ++i)
            {
                let pos = coord.GetCanvasPosByCoord(this.vertices[i % this.vertices.length].coord);
                context.lineTo(pos.x, pos.y);
            }
            context.stroke();
            context.closePath();
            context.fillStyle = this.fillColor;
            context.fill();

            for(let i = 0; i < this.vertices.length; ++i)
            {
                this.vertices[i].Draw(coord, context);
            }
            if(this.drawName && this.name)
            {
                let pos = coord.GetCanvasPosByCoord(this.GetCenterCoord());
                context.fillStyle = 'black';
                context.font = "40px Arial";
                context.fillText(this.name, pos.x, pos.y);
            }
        }
    }
}
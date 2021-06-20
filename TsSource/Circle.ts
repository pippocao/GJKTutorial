module GJKTutorial
{
    export class Circle extends Convex
    {
        private pos : Vec2 = new Vec2(0, 0);
        private radius : number = 1;

        public constructor(centerPos : Vec2, radius : number)
        {
            super();
            this.pos = centerPos;
            this.radius = radius;
        }
        
        public Translate(offset : Vec2) : void
        {
            this.pos = this.pos.Add(offset);
        }

        

        public IsPointInConvex(point : Vec2) : boolean
        {
            return point.Sub(this.pos).magnitudeSqr <= this.radius * this.radius;
        }

        public GetCenterCoord() : Vec2
        {
            return this.pos;
        }

        public Support(dir : Vec2) : Vertex
        {
            return new Vertex(this.pos.Add(dir.Normalize().Mul(this.radius)), this.name);
        }

        public Draw(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D, strokeColor : string, fillColor : string) : void
        {
            let centerPos = coord.GetCanvasPosByCoord(this.pos);
            let radius = coord.GetCanvasPosByCoord(new Vec2(0, this.radius)).Sub(coord.GetCanvasPosByCoord(new Vec2(0, 0))).magnitude;

            context.beginPath();
            context.arc(centerPos.x, centerPos.y, 4, 0, 2 * Math.PI, false);
            context.fillStyle = 'black';
            context.fill();
            context.closePath();

            context.beginPath();
            context.lineWidth = 0.8;
            context.strokeStyle = strokeColor;
            context.arc(centerPos.x, centerPos.y, radius, 0, 2 * Math.PI, false);
            context.stroke();
            context.closePath();
            context.fillStyle = fillColor;
            context.fill();

            if (this.drawName && this.name) {
                context.fillStyle = 'black';
                context.font = "40px Arial";
                context.fillText(this.name, centerPos.x, centerPos.y);
            }
        }
    }
}
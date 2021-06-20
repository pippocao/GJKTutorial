module GJKTutorial
{
    export class Circle extends Convex
    {
        private center : Vec2 = new Vec2(0, 0);
        private radius : number = 1;

        public constructor(centerPos : Vec2, radius : number)
        {
            super();
            this.center = centerPos;
            this.radius = radius;
        }
        
        public Translate(offset : Vec2) : void
        {
            this.center = this.center.Add(offset);
        }

        
        public readonly GetCenter = function() : Readonly<Vec2>
        {
            return this.center;
        }
        

        public readonly GetRadius = function() : number
        {
            return this.radius;
        }

        public IsPointInConvex(point : Vec2) : boolean
        {
            return point.Sub(this.center).magnitudeSqr <= this.radius * this.radius;
        }

        public GetCenterCoord() : Vec2
        {
            return this.center;
        }

        public Support(dir : Vec2) : Vertex
        {
            return new Vertex(this.center.Add(dir.Normalize().Mul(this.radius)), this.name);
        }

        public Draw(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D, strokeColor : string, fillColor : string) : void
        {
            let centerPos = coord.GetCanvasPosByCoord(this.center);
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
module GJKTutorial
{
    export class Capsule extends Convex
    {
        private p0 : Vec2 = new Vec2(0, 0);
        private p1 : Vec2 = new Vec2(0, 0);
        private radius : number = 1;

        public constructor(p0 : Vec2, p1 : Vec2, radius : number)
        {
            super();
            this.p0 = p0.Clone();
            this.p1 = p1.Clone();
            this.radius = radius;
        }
        
        public Translate(offset : Vec2) : void
        {
            this.p0 = this.p0.Add(offset);
            this.p1 = this.p1.Add(offset);
        }

        public readonly GetP0 = function() : Readonly<Vec2>
        {
            return this.p0;
        }

        public readonly GetP1 = function() : Readonly<Vec2>
        {
            return this.p1;
        }

        public readonly GetRadius = function() : number
        {
            return this.radius;
        }

        public IsPointInConvex(point : Vec2) : boolean
        {
            return PointDistanceToSegmentSqr(point, this.p0, this.p1) <= this.radius * this.radius;
        }

        public GetCenterCoord() : Vec2
        {
            return this.p0.Add(this.p1).Div(2);
        }

        public Support(dir : Vec2) : Vertex
        {
            let dotP0 = this.p0.Dot(dir);
            let dotP1 = this.p1.Dot(dir);
            if(dotP0 > dotP1)
            {
                return new Vertex(this.p0.Add(dir.Normalize().Mul(this.radius)), this.name);
            }else{
                return new Vertex(this.p1.Add(dir.Normalize().Mul(this.radius)), this.name);
            }
        }

        public Draw(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D, strokeColor : string, fillColor : string) : void
        {
            let radius = coord.GetCanvasPosByCoord(new Vec2(0, this.radius)).Sub(coord.GetCanvasPosByCoord(new Vec2(0, 0))).magnitude;


            context.lineWidth = 0.8;
            context.strokeStyle = strokeColor;


            let p0Pos = coord.GetCanvasPosByCoord(this.p0);
            let p1Pos = coord.GetCanvasPosByCoord(this.p1);
            let dir = p1Pos.Sub(p0Pos);
            let radiusDir = new Vec2(-dir.y, dir.x);
            radiusDir = radiusDir.Normalize().Mul(radius);
            let p0ArcStart = p0Pos.Add(radiusDir);
            let p1ArcStart = p1Pos.Sub(radiusDir);
            let Arc0StartAngle = Math.acos(radiusDir.x / radius);
            if(dir.x < 0)
            {
                Arc0StartAngle = Math.PI * 2 - Arc0StartAngle;
            }

            context.beginPath();
            context.moveTo(p0ArcStart.x, p0ArcStart.y);
            context.arc(p0Pos.x, p0Pos.y, radius, Arc0StartAngle, Arc0StartAngle + Math.PI, false);
            context.lineTo(p1ArcStart.x, p1ArcStart.y);
            context.arc(p1Pos.x, p1Pos.y, radius, Arc0StartAngle + Math.PI, Arc0StartAngle + Math.PI + Math.PI, false);
            context.lineTo(p0ArcStart.x, p0ArcStart.y);
            context.stroke();
            context.closePath();
            context.fillStyle = fillColor;
            context.fill();
        }
    }
}
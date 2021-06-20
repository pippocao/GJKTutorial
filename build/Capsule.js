var GJKTutorial;
(function (GJKTutorial) {
    class Capsule extends GJKTutorial.Convex {
        constructor(p0, p1, radius) {
            super();
            this.p0 = new GJKTutorial.Vec2(0, 0);
            this.p1 = new GJKTutorial.Vec2(0, 0);
            this.radius = 1;
            this.GetP0 = function () {
                return this.p0;
            };
            this.GetP1 = function () {
                return this.p1;
            };
            this.GetRadius = function () {
                return this.radius;
            };
            this.p0 = p0.Clone();
            this.p1 = p1.Clone();
            this.radius = radius;
        }
        Translate(offset) {
            this.p0 = this.p0.Add(offset);
            this.p1 = this.p1.Add(offset);
        }
        IsPointInConvex(point) {
            return GJKTutorial.PointDistanceToSegmentSqr(point, this.p0, this.p1) <= this.radius * this.radius;
        }
        GetCenterCoord() {
            return this.p0.Add(this.p1).Div(2);
        }
        Support(dir) {
            let dotP0 = this.p0.Dot(dir);
            let dotP1 = this.p1.Dot(dir);
            if (dotP0 > dotP1) {
                return new GJKTutorial.Vertex(this.p0.Add(dir.Normalize().Mul(this.radius)), this.name);
            }
            else {
                return new GJKTutorial.Vertex(this.p1.Add(dir.Normalize().Mul(this.radius)), this.name);
            }
        }
        Draw(deltaMs, coord, context, strokeColor, fillColor) {
            let radius = coord.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, this.radius)).Sub(coord.GetCanvasPosByCoord(new GJKTutorial.Vec2(0, 0))).magnitude;
            context.lineWidth = 0.8;
            context.strokeStyle = strokeColor;
            let p0Pos = coord.GetCanvasPosByCoord(this.p0);
            let p1Pos = coord.GetCanvasPosByCoord(this.p1);
            let dir = p1Pos.Sub(p0Pos);
            let radiusDir = new GJKTutorial.Vec2(-dir.y, dir.x);
            radiusDir = radiusDir.Normalize().Mul(radius);
            let p0ArcStart = p0Pos.Add(radiusDir);
            let p1ArcStart = p1Pos.Sub(radiusDir);
            let Arc0StartAngle = Math.acos(radiusDir.x / radius);
            if (dir.x < 0) {
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
    GJKTutorial.Capsule = Capsule;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Capsule.js.map
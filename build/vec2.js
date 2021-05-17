var GJKTutorial;
(function (GJKTutorial) {
    class Vec2 {
        constructor(_x = 0, _y = 0) {
            this.x = 0;
            this.y = 0;
            this.x = _x;
            this.y = _y;
        }
        get magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        get magnitudeSqr() {
            return this.x * this.x + this.y * this.y;
        }
        Add(rhs) {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        }
        Sub(rhs) {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        }
        Mul(mul) {
            return new Vec2(this.x * mul, this.y * mul);
        }
        Div(mul) {
            return new Vec2(this.x / mul, this.y / mul);
        }
        Dot(rhs) {
            return this.x * rhs.x + this.y * rhs.y;
        }
        Cross(rhs) {
            return this.x * rhs.y - this.y * rhs.x;
        }
        RotateCW(degree) {
            let radian = degree / 180 * Math.PI;
            let sin = Math.sin(-radian);
            let cos = Math.cos(-radian);
            return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
        }
        /// 0 - 360
        GetDegreeToCW(toVec) {
            let thisMag = this.magnitude;
            let toMag = toVec.magnitude;
            if (thisMag == 0 || toMag == 0) {
                return 0;
            }
            let cosine = this.Dot(toVec) / (thisMag * toMag);
            let radian = Math.acos(cosine);
            if (this.Cross(toVec) > 0) {
                radian = 2 * Math.PI - radian;
            }
            return radian * 360 / (2 * Math.PI);
        }
        toString() {
            return "{" + this.x + "," + this.y + "}";
        }
        Normalize() {
            let magnitude = this.magnitude;
            if (magnitude == 0) {
                return new Vec2();
            }
            return this.Div(magnitude);
        }
    }
    GJKTutorial.Vec2 = Vec2;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Vec2.js.map
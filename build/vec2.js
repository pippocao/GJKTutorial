var GJKTutorial;
(function (GJKTutorial) {
    class Vec2 {
        constructor(_x, _y) {
            this.x = 0;
            this.y = 0;
            this.x = _x;
            this.y = _y;
        }
        Add(rhs) {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        }
        Sub(rhs) {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        }
        Dot(rhs) {
            return this.x * rhs.x + this.y + rhs.y;
        }
        toString() {
            return "{" + this.x + "," + this.y + "}";
        }
    }
    GJKTutorial.Vec2 = Vec2;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Vec2.js.map
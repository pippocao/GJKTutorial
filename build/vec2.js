var GJKTutorial;
(function (GJKTutorial) {
    class vec2 {
        constructor(_x, _y) {
            this.x = 0;
            this.y = 0;
            this.x = _x;
            this.y = _y;
        }
        Add(rhs) {
            return new vec2(this.x + rhs.x, this.y + rhs.y);
        }
        Sub(rhs) {
            return new vec2(this.x - rhs.x, this.y - rhs.y);
        }
        Dot(rhs) {
            return this.x * rhs.x + this.y + rhs.y;
        }
        toString() {
            return "{" + this.x + "," + this.y + "}";
        }
    }
    GJKTutorial.vec2 = vec2;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=vec2.js.map
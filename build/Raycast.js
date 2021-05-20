var GJKTutorial;
(function (GJKTutorial) {
    class Raycast {
        constructor(point, dir, length) {
            this._p = point.Clone();
            this._dir = dir.Normalize();
            this._t = length;
        }
        get Point() {
            return this._p;
        }
        get Dir() {
            return this._dir;
        }
        get Length() {
            return this._t;
        }
    }
    GJKTutorial.Raycast = Raycast;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Raycast.js.map
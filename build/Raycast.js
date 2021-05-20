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
        set Point(newStartPoint) {
            this._p = newStartPoint.Clone();
        }
        get Dir() {
            return this._dir;
        }
        set Dir(dir) {
            this._dir = dir.Normalize();
        }
        get Length() {
            return this._t;
        }
        set Length(length) {
            this._t = length;
        }
    }
    GJKTutorial.Raycast = Raycast;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Raycast.js.map
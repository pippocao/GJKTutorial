var GJKTutorial;
(function (GJKTutorial) {
    class Convex {
        constructor() {
            this.drawName = true; //toggle for name display;
            this.fillColor = "#ffffffff";
        }
        get name() {
            return this._name;
        }
        set name(inName) {
            this._name = inName ? inName.toUpperCase() : inName;
        }
    }
    GJKTutorial.Convex = Convex;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Convex.js.map
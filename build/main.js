var GJKTutorial;
(function (GJKTutorial) {
    class DrawingApp {
        constructor() {
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext("2d");
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            let v1 = new GJKTutorial.vec2(5, 6);
            let v2 = new GJKTutorial.vec2(7, -5.5);
            let v3 = v1.Add(v2);
            console.log(v3.toString());
        }
    }
    new DrawingApp();
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=main.js.map
var DrawingApp = /** @class */ (function () {
    function DrawingApp() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        this.m_canvas = canvas;
        this.m_context = context;
        console.log("1");
        console.log(this.m_canvas);
        console.log(this.m_context);
    }
    return DrawingApp;
}());
new DrawingApp();
//# sourceMappingURL=main.js.map
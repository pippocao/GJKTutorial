class DrawingApp {
    private m_canvas : HTMLCanvasElement;
    private m_context : any;
    constructor()
    {
        let canvas = document.getElementById('canvas') as
                 HTMLCanvasElement;
        let context = canvas.getContext("2d");
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
}

new DrawingApp();
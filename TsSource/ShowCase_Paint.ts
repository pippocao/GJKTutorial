module GJKTutorial
{
    class PaintShape{
        strokeColor:string;
        fillColor:string;
        lineWidth = 0;
        dash = [];
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }

    class PaintShapeLine extends PaintShape
    {
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }
    class PaintShapeCircle extends PaintShape
    {
        P0 : Vec2;
        Radius : number
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }
    class PaintShapeRectangle extends PaintShape
    {
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }
    class PaintShapeArrow extends PaintShape
    {
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }



    export function InitShowCase_Paint(framework : Framework
        , canvas:HTMLCanvasElement
        , divStrokeColors:HTMLElement
        , divFillColors:HTMLElement
        , btnThick:HTMLElement
        , btnLineMedium:HTMLElement
        , btnLineThin:HTMLElement
        , btnSolidLine:HTMLElement
        , btnDashLine:HTMLElement
        , btnDrawLine:HTMLElement
        , btnDrawCircle:HTMLElement
        , btnDrawRectangle:HTMLElement
        , btnDrawArrow:HTMLElement) : void
    {
        let strokeColor:string;
        let fillColor:string;
        let lineWidth = 0;
        let dash = [];

        let paintShapes : PaintShape[];
        let previewShape : PaintShape = null;

        let divStrokeColorsBtns = divStrokeColors.getElementsByTagName('button');
        for(let i = 0; i < divStrokeColorsBtns.length; ++i)
        {
            let colorBtn = divStrokeColorsBtns[i];
            let color = colorBtn.style.getPropertyValue('background-color');
            if(i == 0)
            {
                strokeColor = color;
                colorBtn.style.setProperty("outline-style", "solid");
            }
            colorBtn.onclick = (evt)=>{
                strokeColor = color;
                for(let j = 0; j < divStrokeColorsBtns.length; ++j)
                {
                    let btn = divStrokeColorsBtns[j];
                    if(btn == evt.target)
                    {
                        btn.style.setProperty("outline-style", "solid");
                    }else{
                        btn.style.removeProperty("outline-style");
                    }
                }
            }
        }
        let divFillColorsBtns = divFillColors.getElementsByTagName('button');
        for(let i = 0; i < divFillColorsBtns.length; ++i)
        {
            let colorBtn = divFillColorsBtns[i];
            let color = colorBtn.style.getPropertyValue('background-color');
            if(i == 0)
            {
                fillColor = color;
                colorBtn.style.setProperty("outline-style", "solid");
            }
            colorBtn.onclick = (evt)=>{
                fillColor = color;
                for(let j = 0; j < divFillColorsBtns.length; ++j)
                {
                    let btn = divFillColorsBtns[j];
                    if(btn == evt.target)
                    {
                        btn.style.setProperty("outline-style", "solid");
                    }else{
                        btn.style.removeProperty("outline-style");
                    }
                }
            }
        }

        btnThick.onclick = function(){
            lineWidth = 6;
            btnThick.style.setProperty("outline-style", "solid");
            btnLineMedium.style.removeProperty("outline-style");
            btnLineThin.style.removeProperty("outline-style");
        }
        btnLineMedium.onclick = function(){
            lineWidth = 3;
            btnLineMedium.style.setProperty("outline-style", "solid");
            btnThick.style.removeProperty("outline-style");
            btnLineThin.style.removeProperty("outline-style");
        }
        btnLineThin.onclick = function(){
            lineWidth = 1;
            btnLineThin.style.setProperty("outline-style", "solid");
            btnLineMedium.style.removeProperty("outline-style");
            btnThick.style.removeProperty("outline-style");
        }
        btnLineMedium.onclick(null);

        btnSolidLine.onclick = function(){
            dash = [];
            btnSolidLine.style.setProperty("outline-style", "solid");
            btnDashLine.style.removeProperty("outline-style");
        }
        btnDashLine.onclick = function()
        {
            dash = [4, 4];
            btnDashLine.style.setProperty("outline-style", "solid");
            btnSolidLine.style.removeProperty("outline-style");
        }
        btnSolidLine.onclick(null);


        btnDrawLine.onclick = function(){
            btnDrawLine.style.setProperty("outline-style", "solid");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
        }
        btnDrawCircle.onclick = function()
        {
            btnDrawCircle.style.setProperty("outline-style", "solid");
            btnDrawLine.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
        }
        btnDrawRectangle.onclick = function(){
            btnDrawRectangle.style.setProperty("outline-style", "solid");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawLine.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
        }
        btnDrawArrow.onclick = function()
        {
            btnDrawArrow.style.setProperty("outline-style", "solid");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawLine.style.removeProperty("outline-style");
        }
        btnDrawLine.onclick(null);

        console.log(dash.toString() + lineWidth + strokeColor + fillColor);
    }
}
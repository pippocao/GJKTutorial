module GJKTutorial
{
    class PaintShape{
        strokeColor:string;
        fillColor:string;
        lineWidth = 0;
        dash = [];
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {

        }
    }

    class PaintShapeLine extends PaintShape
    {
        public Draw(context : CanvasRenderingContext2D)
        {
            context.moveTo(this.P0.x, this.P0.y);
            context.beginPath();
            context.lineTo(this.P0.x, this.P0.y);
            context.lineTo(this.P1.x, this.P1.y);
            context.stroke();
            context.closePath();
        }
    }
    class PaintShapeCircle extends PaintShape
    {
        public Draw(context : CanvasRenderingContext2D)
        {
            context.beginPath();
            let center = this.P0.Add(this.P1).Div(2);
            let radius = this.P0.Sub(this.P1).magnitude / 2;
            context.arc(center.x, center.y, radius, 0, 360, false);
            context.stroke();
            context.fill();
            context.closePath();
        }
    }
    class PaintShapeRectangle extends PaintShape
    {
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {
            context.beginPath();
            context.rect(this.P0.x, this.P0.y, this.P1.x - this.P0.x, this.P1.y - this.P0.y);
            context.stroke();
            context.fill();
            context.closePath();
        }
    }
    class PaintShapeArrow extends PaintShape
    {
        P0 : Vec2;
        P1 : Vec2;
        public Draw(context : CanvasRenderingContext2D)
        {
            drawArrow(context, this.P0, this.P1, this.lineWidth * 5, this.lineWidth, this.strokeColor);
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
        , btnDisable:HTMLElement
        , btnDrawLine:HTMLElement
        , btnDrawCircle:HTMLElement
        , btnDrawRectangle:HTMLElement
        , btnDrawArrow:HTMLElement
        , btnUndo:HTMLElement
        , btnClear:HTMLElement) : void
    {
        let strokeColor:string;
        let fillColor:string;
        let lineWidth = 0;
        let dash = [];

        let paintShapes : PaintShape[] = [];
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

        btnDisable.onclick = function(){
            btnDisable.style.setProperty("outline-style", "solid");
            btnDrawLine.style.removeProperty("outline-style");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
            previewShape = null;
            framework.RegisterLeftMouseEvent(null ,null, null);
        }

        btnDrawLine.onclick = function(){
            btnDrawLine.style.setProperty("outline-style", "solid");
            btnDisable.style.removeProperty("outline-style");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
            framework.RegisterLeftMouseEvent((evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let line = new PaintShapeLine();
                line.lineWidth = lineWidth;
                line.fillColor = fillColor;
                line.strokeColor = strokeColor;
                line.dash = dash;
                previewShape = line;
                line.P0 = pos.Clone();
                line.P1 = pos.Clone();
            },
            (evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let line = previewShape as PaintShapeLine;
                line.P1 = pos.Clone();
            },(evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let line = previewShape as PaintShapeLine;
                line.P1 = pos.Clone();
                paintShapes.push(line);
                previewShape = null;
            });
        }
        btnDrawCircle.onclick = function()
        {
            btnDrawCircle.style.setProperty("outline-style", "solid");
            btnDisable.style.removeProperty("outline-style");
            btnDrawLine.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
            framework.RegisterLeftMouseEvent((evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let circle = new PaintShapeCircle();
                circle.lineWidth = lineWidth;
                circle.fillColor = fillColor;
                circle.strokeColor = strokeColor;
                circle.dash = dash;
                previewShape = circle;
                circle.P0 = pos.Clone();
                circle.P1 = pos.Clone();
            },
            (evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let circle = previewShape as PaintShapeCircle;
                circle.P1 = pos.Clone();
            },(evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let circle = previewShape as PaintShapeCircle;
                circle.P1 = pos.Clone();
                paintShapes.push(circle);
                previewShape = null;
            });
        }
        btnDrawRectangle.onclick = function(){
            btnDrawRectangle.style.setProperty("outline-style", "solid");
            btnDisable.style.removeProperty("outline-style");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawLine.style.removeProperty("outline-style");
            btnDrawArrow.style.removeProperty("outline-style");
            framework.RegisterLeftMouseEvent((evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let rect = new PaintShapeRectangle();
                rect.lineWidth = lineWidth;
                rect.fillColor = fillColor;
                rect.strokeColor = strokeColor;
                rect.dash = dash;
                previewShape = rect;
                rect.P0 = pos.Clone();
                rect.P1 = pos.Clone();
            },
            (evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let rect = previewShape as PaintShapeRectangle;
                rect.P1 = pos.Clone();
            },(evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let rect = previewShape as PaintShapeRectangle;
                rect.P1 = pos.Clone();
                paintShapes.push(rect);
                previewShape = null;
            });
        }
        btnDrawArrow.onclick = function()
        {
            btnDrawArrow.style.setProperty("outline-style", "solid");
            btnDisable.style.removeProperty("outline-style");
            btnDrawCircle.style.removeProperty("outline-style");
            btnDrawRectangle.style.removeProperty("outline-style");
            btnDrawLine.style.removeProperty("outline-style");
            framework.RegisterLeftMouseEvent((evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let arrow = new PaintShapeArrow();
                arrow.lineWidth = lineWidth;
                arrow.fillColor = fillColor;
                arrow.strokeColor = strokeColor;
                arrow.dash = dash;
                previewShape = arrow;
                arrow.P0 = pos.Clone();
                arrow.P1 = pos.Clone();
            },
            (evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let arrow = previewShape as PaintShapeArrow;
                arrow.P1 = pos.Clone();
            },(evt)=>{
                let pos = new Vec2(evt.offsetX, evt.offsetY);
                let arrow = previewShape as PaintShapeArrow;
                arrow.P1 = pos.Clone();
                paintShapes.push(arrow);
                previewShape = null;
            });
        }
        btnDisable.onclick(null);

        btnUndo.onclick = function(evt){
            paintShapes.pop();
            previewShape = null;
        }

        btnClear.onclick = function(evt){
            paintShapes = [];
            previewShape = null;
        }

        framework.AddCustomDrawFunctionFinal((deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void=>{
            if(paintShapes)
            {
                for(let i = 0; i < paintShapes.length; ++i)
                {
                    let shape = paintShapes[i];
                    context.lineWidth = shape.lineWidth;
                    context.fillStyle = shape.fillColor;
                    context.strokeStyle = shape.strokeColor;
                    context.setLineDash(shape.dash);
                    shape.Draw(context);
                    context.setLineDash([]);
                }
            }
            if(previewShape)
            {
                let shape = previewShape;
                context.lineWidth = shape.lineWidth;
                context.fillStyle = shape.fillColor;
                context.strokeStyle = shape.strokeColor;
                context.setLineDash(shape.dash);
                shape.Draw(context);
                context.setLineDash([]);
            }
        });
    }
}
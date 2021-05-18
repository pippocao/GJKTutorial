module GJKTutorial
{
    export class Coordinate
    {
        private canvas : HTMLCanvasElement;
        private imageCache : ImageData = null;
        private _coordXMax : number = 16.5;
        private _coordYMax : number = 16.5;

        constructor(inCanvas : HTMLCanvasElement)
        {
            this.canvas = inCanvas;
        }

        get canvasWidth() : number
        {
            return this.canvas.height;
        }

        get canvasHeight() : number
        {
            return this.canvas.height;
        }

        get coordXMax() : number
        {
            return this._coordXMax;
        }

        get coordYMax() : number
        {
            return this._coordYMax;
        }

        set coordXMax(xMax : number)
        {
            this._coordXMax = xMax;
            this.imageCache = null;
        }

        set coordYMax(yMax : number)
        {
            this._coordYMax = yMax;
            this.imageCache = null;
        }

        public GetCanvasPosByCoord(coord : Vec2) : Vec2
        {
            return new Vec2(this.canvasWidth / 2 * coord.x / this.coordXMax + this.canvasWidth / 2, this.canvasHeight / 2 - this.canvasHeight / 2 * coord.y / this.coordYMax);
        }


        public GetCoordByCanvasPos(pos : Vec2) : Vec2
        {
            return new Vec2(pos.x / this.canvasWidth * this.coordXMax * 2 - this.coordXMax, this.coordYMax - pos.y / this.canvasHeight * this.coordYMax * 2);
        }

        public Draw(deltaMs : number, context : CanvasRenderingContext2D) : void
        {
            if(this.imageCache)
            {
                context.putImageData(this.imageCache, 0, 0);
                return;
            }

            //Draw X and Y Axis
            context.beginPath();
            let coordXMin_Pos : Vec2 = this.GetCanvasPosByCoord(new Vec2(-this.coordXMax, 0));
            let coordXMan_Pos : Vec2 = this.GetCanvasPosByCoord(new Vec2(this.coordXMax, 0));
            let coordYMin_Pos : Vec2 = this.GetCanvasPosByCoord(new Vec2(0, -this.coordYMax));
            let coordYMax_Pos : Vec2 = this.GetCanvasPosByCoord(new Vec2(0, this.coordYMax));
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.moveTo(coordXMin_Pos.x, coordXMin_Pos.y);
            context.lineTo(coordXMan_Pos.x, coordXMan_Pos.y);

            context.moveTo(coordYMin_Pos.x, coordYMin_Pos.y);
            context.lineTo(coordYMax_Pos.x, coordYMax_Pos.y);

            context.stroke();
            context.closePath();

            //Draw Coord Grids
            context.lineWidth = 0.5;
            context.setLineDash([3, 6]);
            context.strokeStyle = "#00ff00";
            context.beginPath();
            let xInt = Math.floor(this.coordXMax);
            let yInt = Math.floor(this.coordYMax);
            for(let x = -xInt; x <= xInt; ++x)
            {
                if(x == 0)
                {
                    continue;
                }
                let minPos : Vec2 = this.GetCanvasPosByCoord(new Vec2(x, -this.coordYMax));
                let maxPos : Vec2 = this.GetCanvasPosByCoord(new Vec2(x, this.coordYMax));
                context.moveTo(minPos.x, minPos.y);
                context.lineTo(maxPos.x, maxPos.y);
            }

            
            for(let y = -yInt; y <= yInt; ++y)
            {
                if(y == 0)
                {
                    continue;
                }
                let minPos : Vec2 = this.GetCanvasPosByCoord(new Vec2(-this.coordXMax, y));
                let maxPos : Vec2 = this.GetCanvasPosByCoord(new Vec2(this.coordXMax, y));
                context.moveTo(minPos.x, minPos.y);
                context.lineTo(maxPos.x, maxPos.y);
            }
            context.stroke();
            context.closePath();
            context.setLineDash([]);

            this.imageCache = context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
}
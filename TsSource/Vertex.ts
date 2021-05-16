module GJKTutorial
{
    export class Vertex
    {
        public coord : Vec2;
        public name : string;   //for display
        public drawName : boolean = true;  //toggle for name display;

        constructor(inCoord : Vec2, inName : string)
        {
            this.coord = new Vec2(inCoord.x, inCoord.y);
            this.name = inName;
        }

        private static numToString(num : number, accuracy : number) : string
        {
            let mul = Math.pow(10, accuracy);
            num = num * mul;
            num = Math.round(num);
            num = num / mul;
            return num + "";
        }

        public Draw(coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(!this.drawName)
            {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.font = "30px Arial";
            context.fillStyle = "#000000FF";
            context.fillText(this.name + "(" + Vertex.numToString(this.coord.x, 2) + "," + Vertex.numToString(this.coord.y, 2) + ")", pos.x, pos.y);
        }
    }
}
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

        public Draw(coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(!this.drawName)
            {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.strokeText(this.name, pos.x, pos.y);
        }
    }
}
module GJKTutorial
{
    export class Vertex
    {
        public coord : Vec2;
        public drawName : boolean = true;  //toggle for name display;

        private _name : string;

        public get name() : string   //for display
        {
            return this._name;
        }

        public set name(inName : string)
        {
            this._name = inName ? inName.toLowerCase() : inName;
        }

        constructor(inCoord : Vec2, inName : string)
        {
            this.coord = inCoord.Clone();
            this.name = inName;
        }

        public Draw(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D) : void
        {
            if(!this.drawName)
            {
                return;
            }
            let pos = coord.GetCanvasPosByCoord(this.coord);
            context.font = "30px Arial";
            context.fillStyle = "#000000FF";
            context.fillText(this.name + "(" + numToString(this.coord.x, 2) + "," + numToString(this.coord.y, 2) + ")", pos.x, pos.y);
        }
    }
}
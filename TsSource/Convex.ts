module GJKTutorial
{
    export abstract class Convex
    {
        public drawName : boolean = true;  //toggle for name display;
        public fillColor : string = "#ffffffff";
        private _name : string;

        public get name() : string   //for display
        {
            return this._name;
        }

        public set name(inName : string)
        {
            this._name = inName ? inName.toUpperCase() : inName;
        }

        
        public abstract Translate(offset : Vec2) : void;
        

        public abstract IsPointInConvex(point : Vec2) : boolean;
        

        public abstract GetCenterCoord() : Vec2;


        public abstract Support(dir : Vec2) : Vertex;


        public abstract Draw(deltaMs : number, coord : Coordinate, context : CanvasRenderingContext2D, strokeColor : string, fillColor : string) : void;
    }
}
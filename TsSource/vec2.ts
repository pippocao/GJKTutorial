module GJKTutorial
{
    export class vec2
    {
        public x : number = 0;
        public y : number = 0;
    
        constructor(_x : number, _y : number)
        {
            this.x = _x;
            this.y = _y;
        }
    
        public Add (rhs : vec2) : vec2
        {
            return new vec2(this.x + rhs.x, this.y + rhs.y);
        }
    
        public Sub (rhs : vec2) : vec2
        {
            return new vec2(this.x - rhs.x, this.y - rhs.y);
        }
    
        public Dot (rhs : vec2) : number
        {
            return this.x * rhs.x + this.y + rhs.y;
        }
    
        public toString() : string
        {
            return "{" + this.x + "," + this.y + "}";
        }
    }
}
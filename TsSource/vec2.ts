module GJKTutorial
{
    export class Vec2
    {
        public x : number = 0;
        public y : number = 0;
    
        constructor(_x : number, _y : number)
        {
            this.x = _x;
            this.y = _y;
        }
    
        public Add (rhs : Vec2) : Vec2
        {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        }
    
        public Sub (rhs : Vec2) : Vec2
        {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        }
    
        public Dot (rhs : Vec2) : number
        {
            return this.x * rhs.x + this.y + rhs.y;
        }
    
        public toString() : string
        {
            return "{" + this.x + "," + this.y + "}";
        }
    }
}
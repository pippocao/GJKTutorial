module GJKTutorial
{
    export class Vec2
    {
        public x : number = 0;
        public y : number = 0;
    
        constructor(_x : number = 0, _y : number = 0)
        {
            this.x = _x;
            this.y = _y;
        }

        public get magnitude() : number
        {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        public get magnitudeSqr() : number
        {
            return this.x * this.x + this.y * this.y;
        }
    
        public Add (rhs : Vec2) : Vec2
        {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        }
    
        public Sub (rhs : Vec2) : Vec2
        {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        }

        public Mul(mul : number) : Vec2
        {
            return new Vec2(this.x * mul, this.y * mul);
        }

        public Div(mul : number) : Vec2
        {
            return new Vec2(this.x / mul, this.y / mul);
        }
    
        public Dot (rhs : Vec2) : number
        {
            return this.x * rhs.x + this.y + rhs.y;
        }

        public Cross(rhs : Vec2) : number
        {
            return this.x * rhs.y - this.y * rhs.x;
        }
    
        public toString() : string
        {
            return "{" + this.x + "," + this.y + "}";
        }
    }
}
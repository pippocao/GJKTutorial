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
            return this.x * rhs.x + this.y * rhs.y;
        }

        public Cross(rhs : Vec2) : number
        {
            return this.x * rhs.y - this.y * rhs.x;
        }

        public Equals(rhs : Vec2) : boolean
        {
            return (Math.abs(this.x - rhs.x) < Number.EPSILON) && (Math.abs(this.y - rhs.y) < Number.EPSILON);
        }

        public Clone() : Vec2
        {
            return new Vec2(this.x, this.y);
        }

        public RotateCW(degree : number) : Vec2
        {
            let radian = degree / 180 * Math.PI;
            let sin = Math.sin(-radian);
            let cos = Math.cos(-radian);
            return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
        }

        /// 0 - 360
        public GetDegreeToCW(toVec : Vec2) : number
        {
            let thisMag = this.magnitude;
            let toMag = toVec.magnitude;
            if(thisMag == 0 || toMag == 0)
            {
                return 0;
            }
            let cosine = this.Dot(toVec) / (thisMag * toMag);

            let radian = Math.acos(cosine);

            if(this.Cross(toVec) > 0)
            {
                radian = 2 * Math.PI - radian;
            }
            return radian * 360 / (2 * Math.PI);
        }
    
        public toString() : string
        {
            return "{" + this.x + "," + this.y + "}";
        }

        public Normalize() : Vec2
        {
            let magnitude = this.magnitude;
            if(magnitude == 0)
            {
                return new Vec2();
            }
            return this.Div(magnitude);
        }
    }
}
module GJKTutorial
{
    export class Raycast
    {
        public p : Vec2;              //startPoint
        public dirNormalized : Vec2;  //direction
        public t : number;            //length

        constructor(startPoint : Vec2, dir : Vec2, length : number)
        {
            this.p = startPoint;
            this.dirNormalized = dir.Normalize();
            this.t = length;
        }

        public get P() : Readonly<Vec2>
        {
            return this.p;
        }

        public get Dir() : Readonly<Vec2>
        {
            return this.dirNormalized;
        }

        public get length() : number
        {
            return this.t;
        }
    }
}
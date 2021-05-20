module GJKTutorial
{
    export class Raycast
    {
        public _p : Vec2;   //start point
        public _dir : Vec2;  //normalized dir
        public _t : number; //raycast length;

        constructor(point : Vec2, dir : Vec2, length:number)
        {
            this._p = point.Clone();
            this._dir = dir.Normalize();
            this._t = length;
        }

        public get Point() : Readonly<Vec2>
        {
            return this._p;
        }

        public get Dir() : Readonly<Vec2>
        {
            return this._dir;
        }

        public get Length() : number
        {
            return this._t;
        }
    }
}
module GJKTutorial
{
    export class Raycast
    {
        private _p : Vec2;   //start point
        private _dir : Vec2;  //normalized dir
        private _t : number; //raycast length;

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

        public set Point(newStartPoint : Readonly<Vec2>)
        {
            this._p = newStartPoint.Clone();
        }

        public get Dir() : Readonly<Vec2>
        {
            return this._dir;
        }

        public set Dir(dir : Readonly<Vec2>)
        {
            this._dir = dir.Normalize();
        }

        public get Length() : number
        {
            return this._t;
        }

        public set Length(length : number)
        {
            this._t = length;
        }
    }
}
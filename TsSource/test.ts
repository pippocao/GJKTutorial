


    class Vec3
    {
        X : number;
        Y : number;
        Z : number;

        static Zero : Vec3 = new Vec3();

        public Sub(rhs : Vec3)
        {
            return rhs;
        }
        public Add(rhs : Vec3)
        {
            return rhs;
        }
        public Mul(rhs : number) : Vec3
        {
            return this;
        }
    }

    class OBB
    {
        extend : Vec3;

        public TransToLocal(point : Vec3) : Vec3
        {
            return point;
        }

        public TransToGlobal(point : Vec3) : Vec3
        {
            return point;
        }
    }

    class AABB
    {
        extend : Vec3;

        constructor(ext : Vec3)
        {
            this.extend = ext;
        }
    }

    function RaycastOBB(obb : OBB, startPoint : Vec3, dir : Vec3, distance : number): {collided : boolean, hitPoint : Vec3, normal : Vec3, distance : number}
    {
        return {collided : true, hitPoint : null, normal : null, distance : 0}
    }

    function MoveAloneDir(dir : Vec3, normal : Vec3) : Vec3
    {
        return dir;
    }

    function Move(startPoint : Vec3, dir : Vec3, distance : number, collision : OBB) : Vec3
    {
        let currentPos = startPoint;
        let currentDir = dir;
        let maxIterate = 3;
        let leftDistance = distance;
        while(leftDistance > 0 && maxIterate-- >= 0)
        {
            let raycastResult = RaycastOBB(collision, startPoint, dir, leftDistance);
            if(!raycastResult.collided)
            {
                return currentPos.Add(currentDir.Mul(leftDistance));
            }
            currentPos = raycastResult.hitPoint;
            leftDistance -= raycastResult.distance;
            currentDir = MoveAloneDir(currentDir, raycastResult.normal);
        }
        return currentPos;
    }
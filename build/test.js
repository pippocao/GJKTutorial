class Vec3 {
    Sub(rhs) {
        return rhs;
    }
    Add(rhs) {
        return rhs;
    }
    Mul(rhs) {
        return this;
    }
}
Vec3.Zero = new Vec3();
class OBB {
    TransToLocal(point) {
        return point;
    }
    TransToGlobal(point) {
        return point;
    }
}
class AABB {
    constructor(ext) {
        this.extend = ext;
    }
}
function RaycastOBB(obb, startPoint, dir, distance) {
    return { collided: true, hitPoint: null, normal: null, distance: 0 };
}
function MoveAloneDir(dir, normal) {
    return dir;
}
function Move(startPoint, dir, distance, collision) {
    let currentPos = startPoint;
    let currentDir = dir;
    let maxIterate = 3;
    let leftDistance = distance;
    while (leftDistance > 0 && maxIterate-- >= 0) {
        let raycastResult = RaycastOBB(collision, startPoint, dir, leftDistance);
        if (!raycastResult.collided) {
            return currentPos.Add(currentDir.Mul(leftDistance));
        }
        currentPos = raycastResult.hitPoint;
        leftDistance -= raycastResult.distance;
        currentDir = MoveAloneDir(currentDir, raycastResult.normal);
    }
    return currentPos;
}
//# sourceMappingURL=test.js.map
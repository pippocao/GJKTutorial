module GJKTutorial
{
    export function numToString(num : number, accuracy : number) : string
    {
        let mul = Math.pow(10, accuracy);
        num = num * mul;
        num = Math.round(num);
        num = num / mul;
        return num + "";
    }

    //custom alphabet decode 
    export function DecodeCustomCharCode(code : number, isSmallCase : boolean) : string
    {
        let startAsciiCode : number = isSmallCase ? 97 : 65; //97 is ascii code of letter 'a' while 65 is that of letter 'A';
        let name ='';
        do{
            let tail = code % 26;
            name = String.fromCharCode(startAsciiCode + tail) + name;    
            code = (code - tail) / 26;
        }while(code > 0);
        return name;
    }

    //custom alphabet encode
    export function EncodeCustomCharCode(text : string) : number
    {
        let result = 0;
        for(let i = 0; i < text.length; ++i)
        {
            let char = text.charCodeAt(i);
            if(char >= 65 && char <= 90)  //upperCase
            {
                char -= 65;
            }else if(char >= 97 && char <= 122)
            {
                char -= 97;  //lowerCase
            }
            result += char * Math.pow(26, text.length - 1 - i);
        }
        return result;
    }
    
    //try to make a convex as small as possible to surround all the input vertices
    //the return value is in cw order, may be some inner vertices will be discarded.
    export function GetConvexFromVertices(vertices : Vertex[]) : Vertex[]
    {
        let result : Vertex[] = [];

        let startVertexIndex = -1;
        for(let i = 0; i < vertices.length; ++i)
        {
            let vertex = vertices[i];
            if(startVertexIndex < 0)
            {
                startVertexIndex = i;
            }else if(vertex.coord.x < vertices[startVertexIndex].coord.x){
                startVertexIndex = i;
            }else if(vertex.coord.x == vertices[startVertexIndex].coord.x && vertex.coord.y > vertices[startVertexIndex].coord.y)
            {
                startVertexIndex = i;
            }
        }

        let startVertex = vertices[startVertexIndex];
        result.push(startVertex);

        while(true)
        {
            let fromDir = new Vec2(0, 1);   //up direction
            for(let i = result.length - 1; i > 0; --i)
            {
                let dir = result[i].coord.Sub(result[i - 1].coord);
                if(dir.magnitudeSqr != 0)
                {
                    fromDir = dir;
                    break;
                }
            }
            let currentStartCoord = result[result.length - 1].coord;
            let nextVertexIndex = -1;
            let nextVertexDegree = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < vertices.length; ++i)
            {
                let candidiateCoord = vertices[i].coord;
                let candidiateDir = candidiateCoord.Sub(currentStartCoord);
                if(Math.abs(candidiateDir.x) < Number.EPSILON && Math.abs(candidiateDir.y) < Number.EPSILON)
                {
                    //ignore overlapping vertex
                    continue;
                }
                let candidiateDegreeCw = fromDir.GetDegreeToCW(candidiateDir);
                if(candidiateDegreeCw < nextVertexDegree)
                {
                    nextVertexIndex = i;
                    nextVertexDegree = candidiateDegreeCw;
                }
            }

            let nextVertex = vertices[nextVertexIndex];
            if(nextVertex == startVertex)
            {
                break;
            }
            result.push(nextVertex);
        }

        return result;
    }

      
      
    export function PointDistanceToSegmentSqr (point : Vec2, segmentP0 : Vec2, segmentP1 : Vec2) : number{
        let l2 = segmentP0.Sub(segmentP1).magnitudeSqr;
        if (l2 === 0) 
        {
            return segmentP0.Sub(point).magnitudeSqr;
        }
        let t = ((point.x - segmentP0.x) * (segmentP1.x - segmentP0.x) + (point.y - segmentP0.y) * (segmentP1.y - segmentP0.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return new Vec2(segmentP0.x + t * (segmentP1.x - segmentP0.x), segmentP0.y + t * (segmentP1.y - segmentP0.y)).Sub(point).magnitudeSqr;
      }
      
      
      export function PointDistanceToSegment (point : Vec2, segmentP0 : Vec2, segmentP1 : Vec2) {
        return Math.sqrt(PointDistanceToSegmentSqr(point, segmentP0, segmentP1));
      }


    //draw a directional arrow
    export function drawArrow(context : CanvasRenderingContext2D, startPos : Vec2, endPos : Vec2, arrowLength : number, width : number, color : string)
    {
        context.lineWidth = width;
        context.strokeStyle = color;
        context.moveTo(startPos.x, startPos.y);
        context.beginPath();
        context.lineTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);

        let dir = endPos.Sub(startPos).Normalize().Mul(arrowLength);
        let leftDir = dir.RotateCW(240);
        let rightDir = dir.RotateCW(120);

        let leftArrowPoint = endPos.Add(leftDir);
        context.lineTo(leftArrowPoint.x, leftArrowPoint.y);
        let rightArrowPoint = endPos.Add(rightDir);
        context.lineTo(rightArrowPoint.x, rightArrowPoint.y);
        context.lineTo(endPos.x, endPos.y);
        context.stroke();
        context.closePath();
    }
}
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
}
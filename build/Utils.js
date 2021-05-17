var GJKTutorial;
(function (GJKTutorial) {
    function numToString(num, accuracy) {
        let mul = Math.pow(10, accuracy);
        num = num * mul;
        num = Math.round(num);
        num = num / mul;
        return num + "";
    }
    GJKTutorial.numToString = numToString;
})(GJKTutorial || (GJKTutorial = {}));
//# sourceMappingURL=Utils.js.map
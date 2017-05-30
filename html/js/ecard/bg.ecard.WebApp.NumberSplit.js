bg.ecard.WebApp.NumberSplit = function (numToSplit) {

    var digits = ("" + numToSplit).split("");
    var separator = ',';
    var arrLength = digits.length;
    var resultArr = [];
    var resultString = "";

    for (var index = Math.floor(arrLength / 3); index > 0; index--) {
        if (arrLength - 3) {
            digits.splice((arrLength - 3), 0, separator)
        }
        arrLength -= 3;

    }

    for (var e = 0; e < digits.length; e++) {
        var newSpan = document.createElement("span");
        var newContent = document.createTextNode(digits[e]);
        newSpan.appendChild(newContent);
        resultArr.push(newSpan.innerHTML);
    }

    resultString = resultArr.join("");
    return resultString;
}

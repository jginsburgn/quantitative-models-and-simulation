const readline =  require("readline");

function getCoefficientOfCorrelation(sequence, M, lag, initialPosition) {
    var partialSum = 0;
    for (var i = 0; i < M; ++i) {
        partialSum += sequence[initialPosition + i * lag] * sequence[initialPosition + (i + 1) * lag];
    }
    return partialSum/(M + 1) - 0.25;
}

function getStandardDeviationOfCoefficientOfCorrelation(M) {
    return Math.sqrt(13 * M + 7)/(12*(M + 1));
}

function getM(sequenceSize, lag, initialPosition) {
    return Math.floor((sequenceSize - initialPosition)/lag - 1);
}

function getTestStatistic(sequence, lag, initialPosition) {
    console.log("Getting M");
    var M = getM(sequence.length, lag, initialPosition);
    console.log("M =", M);
    console.log("Getting Coefficient of Correlation");
    var coefficientOfCorrelation = getCoefficientOfCorrelation(sequence, M, lag, initialPosition);
    console.log("Coefficient of Correlation =", coefficientOfCorrelation);
    console.log("Getting Standard Deviation of Coefficient of Correlation");
    var standardDeviationOfCoefficientOfCorrelation = getStandardDeviationOfCoefficientOfCorrelation(M);
    console.log("Standard Deviation Coefficient of Correlation =", standardDeviationOfCoefficientOfCorrelation);
    return coefficientOfCorrelation/standardDeviationOfCoefficientOfCorrelation;
}

function main() {
    var sequence = [];
    var interface = readline.createInterface({
        input: process.stdin
    });
    interface.on("line", (line) => {
        sequence.push(parseInt(line));
    });
    interface.on("close", ()=> {
        var maximumPossibleElement = Math.pow(10, 16) - 1;
        for (var i = 0; i < sequence.length; ++i) { 
            sequence[i] = sequence[i] / maximumPossibleElement;
        }
        var statistic = getTestStatistic(sequence, 5, 0);
        console.log(`The random number generator has as statistic: ${statistic}, it is considered ${statistic < 1.96 ? "good" : "bad"}.`);
    })
}

main();
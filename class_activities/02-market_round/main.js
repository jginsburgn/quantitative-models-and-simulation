// Jonathan Ginsburg. January 11, 2018.
// Get the average unit price of charging 100 per unit if a uniformly distributed random number in the real interval [0, 1) falls in the interval [0, 0.2) and 99 if else.

function averageUnitPrice(simulationCount) {
	var accumulatedSum = 0;
	for (var i = 0; i < simulationCount; ++i) {
		if (Math.random() < 0.20) {
			accumulatedSum += 100;	
		}
		else {
			accumulatedSum += 99;
		}
	}
	return accumulatedSum/simulationCount;
}

console.log(averageUnitPrice(5000));

function inRange(leftClosed, rightOpen, value) {
	return leftClosed <= value && value < rightOpen;
}

function incomingCarsCount() {
	var random = Math.random();
	if (inRange(0, 0.05, random)) return 3;
	if (inRange(0.05, 0.2, random)) return 4;
	if (inRange(0.2, 0.5, random)) return 5;
	if (inRange(0.5, 0.75, random)) return 6;
	if (inRange(0.75, 0.9, random)) return 7;
	if (inRange(0.9, 1, random)) return 8;
}

function carSize() {
	var random = Math.random();
	if (inRange(0, 1/3, random)) return "small";
	if (inRange(1/3, 2/3, random)) return "medium";
	if (inRange(2/3, 1, random)) return "large";
}

function costForSmall() {
	var random = Math.random();
	if (inRange(0, 0.45, random)) return 350;
	if (inRange(0.45, 0.6, random)) return 1575;
	if (inRange(0.6, 0.8, random)) return 1925;
	if (inRange(0.8, 0.9, random)) return 1540;
	else return 700;
}

function costForMedium() {
	var random = Math.random();
	if (inRange(0, 0.25, random)) return 550;
	if (inRange(0.25, 0.5, random)) return 1975;
	if (inRange(0.5, 0.65, random)) return 2545;
	if (inRange(0.65, 0.85, random)) return 2925;
	if (inRange(0.85, 1, random)) return 700;
}

function costForLarge() {
	var random = Math.random();
	if (inRange(0, 0.10, random)) return 750;
	if (inRange(0.10, 0.25, random)) return 2275;
	if (inRange(0.25, 0.55, random)) return 2845;
	if (inRange(0.55, 0.95, random)) return 3415;
	if (inRange(0.95, 1, random)) return 700;
}

function getCostForADay() {
	var accumulatedCost = 0;
	var cars = incomingCarsCount();
	for (var i = 0; i < cars; ++i) {
		var carS = carSize();
		switch (carS) {
			case "small":
				accumulatedCost += costForSmall();
				break;
			case "medium":
				accumulatedCost += costForMedium();
				break;
			case "large":
				accumulatedCost += costForLarge();
				break;
		}
	}
	return accumulatedCost;
}

function getSimulations(count) {
	var retVal = [];
	for (var i = 0; i < count; ++i) {
		retVal.push(getCostForADay());
	}
	return retVal;
}

function reportStatistics() {
	var simulations = getSimulations(5000);
	console.log(simulations.length);
	var average = 0;
	var standardDeviation = 0;
	for (var i = 0; i < simulations.length; ++i) {
		average += simulations[i];
	}
	average = average/simulations.length;
	for (var i = 0; i < simulations.length; ++i) {
		standardDeviation += Math.pow(average - simulations[i], 2);
	}
	standardDeviation = Math.sqrt(standardDeviation/(simulations.length - 1));
	console.log(`Car service shop simulator by Jonathan Ginsburg A01021617. January 22, 2018.`);
	console.log(`Mean: ${average}, Standard Deviation: ${standardDeviation}.`);
	console.log(`The confidence interval for 75% is [${average-1.15*standardDeviation/Math.sqrt(simulations.length)}, ${average+1.15*standardDeviation/Math.sqrt(simulations.length)}]`);
	console.log(`The confidence interval for 80% is [${average-1.2815*standardDeviation/Math.sqrt(simulations.length)}, ${average+1.2815*standardDeviation/Math.sqrt(simulations.length)}]`);
	console.log(`The confidence interval for 85% is [${average-1.4395*standardDeviation/Math.sqrt(simulations.length)}, ${average+1.4395*standardDeviation/Math.sqrt(simulations.length)}]`);
	console.log(`The confidence interval for 90% is [${average-1.6448*standardDeviation/Math.sqrt(simulations.length)}, ${average+1.6448*standardDeviation/Math.sqrt(simulations.length)}]`);
	console.log(`The confidence interval for 95% is [${average-1.9599*standardDeviation/Math.sqrt(simulations.length)}, ${average+1.9599*standardDeviation/Math.sqrt(simulations.length)}]`);
}

reportStatistics();

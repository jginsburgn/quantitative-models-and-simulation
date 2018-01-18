function poleProbability(successProbability) {
	return Math.random() < successProbability;	
}

function inInterval(leftClosed, rightOpen, value) {
	return leftClosed <= value && value < rightOpen;
}

function answeredCall() {
	return Math.random() < 0.3;
}

function isFemale() {
	return Math.random() < 0.8;
}

function boughtCard(isFemale) {
	if (isFemale) {
		return Math.random() < 0.15;
	}
	else {
		return Math.random() < 0.25;
	}
}

function assignedCredit(isFemale) {
	var randVal = Math.random();
	if (isFemale) {
		if (inInterval(0, 0.6, randVal)) return 5000;
		if (inInterval(0.6, 0.9, randVal)) return 10000;
		if (inInterval(0.9, 1, randVal)) return 15000;
	}
	else {
		if (inInterval(0, 0.1, randVal)) return 5000;
		if (inInterval(0.1, 0.5, randVal)) return 10000;
		if (inInterval(0.5, 0.8, randVal)) return 15000;
		if (inInterval(0.8, 1, randVal)) return 20000;
	}
}

function getComissionForSimulation(simulationsCount) {
	var comission = 0;
	for (var i = 0; i < simulationsCount; ++i) {
		if (answeredCall()) {
			var isWoman = isFemale();
			if ((isWoman && boughtCard(isWoman)) || (!isWoman && boughtCard(isWoman))) {
				comission += assignedCredit(isWoman)/5000 * 200;
			}
		}
	}
	return comission;
}

function main() {
	var comissions = [];
	var accumulatedComissions = 0;
	for (var i = 0; i < 5000; i++) {
		comissions.push(getComissionForSimulation(5000));
		accumulatedComissions += comissions[i];
	}
	var average = accumulatedComissions/5000;
	var standardDeviation = 0;
	for (var com of comissions) {
		standardDeviation += Math.pow(com-average, 2);
	}
	standardDeviation/(comissions.length-1);
	standardDeviation = Math.sqrt(standardDeviation);
	var lowerLimit = average - 1.96 * standardDeviation/Math.sqrt(5000);
	var upperLimit = average + 1.96 * standardDeviation/Math.sqrt(5000);
	console.log("Credit Card Comissions Simulator by Jonathan Ginsburg A01021617. January 18, 2018.")
	console.log(`An accumulated comission after 5000 simulations is: ${comissions[0]}`);
	console.log(`The 95% confidence interval of the accumulated comission after 5000 simulations is: [${lowerLimit}, ${upperLimit}]`);
	console.log(`The average accumulated comission after 5000 simulations is: ${average}`);
}

main();

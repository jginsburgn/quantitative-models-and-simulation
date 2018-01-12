function randomVSFixedPerSimulation(simulationCount, eventSpaceSize) {
	var fixedSuccessCount = 0;
	var randomSuccessCount = 0;
	var getRandomNumber = () => {return Math.floor(Math.random()*eventSpaceSize)};
	var fixedNumber = getRandomNumber();
	for (var i = 0; i < simulationCount; ++i) {
		var simulationNumber = getRandomNumber();
		if (fixedNumber == simulationNumber) fixedSuccessCount++;
		if (getRandomNumber() == simulationNumber) randomSuccessCount++;
	}
	return {randomWinProb: randomSuccessCount/eventSpaceSize, fixedWinProb: fixedSuccessCount/eventSpaceSize};
}

console.log(randomVSFixedPerSimulation(50000, 5000));

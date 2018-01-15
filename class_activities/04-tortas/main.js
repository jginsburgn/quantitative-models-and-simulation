console.log("Authored by: Jonathan Ginsburg (A01021617), Arthur Alves (A01022594), and Adrian Biller (A01018940).");

// For elements x and y of this variable it must be true that x.maxRandom < y.maxRandom if i < j and x = v[i] and y = v[j] having v as a variable
var intervalDefinitions = [
	{maxRandom: 0.05, dozens: 1},
	{maxRandom: 0.15, dozens: 2},
	{maxRandom: 0.35, dozens: 3},
	{maxRandom: 0.75, dozens: 4},
	{maxRandom: 0.95, dozens: 5},
	{maxRandom: 1.00, dozens: 6}
];

// Get the dozens count of a given day given a randomNumber in [0, 1)
function getDozensDemandCount(randomNumber) {
	for (var intervalDefinition of intervalDefinitions) {
		if (randomNumber < intervalDefinition.maxRandom)
			return intervalDefinition.dozens;
	}
}

// Return the accumulated balance of the shop after simulationsCount days
function runSimulations(dailyProducedDozens, simulationsCount) {
	var balance = 0;
	var tortasCount = 0;
	for (var i = 0; i < simulationsCount; i++) {
		// A day begins
		tortasCount = dailyProducedDozens * 12;
		balance += tortasCount * 12 * -1;
		var tortasCountDemand = getDozensDemandCount(Math.random()) * 12;
		if (tortasCount >= tortasCountDemand) {
			balance += tortasCountDemand * 16;
			tortasCount -= tortasCountDemand;
			var secondHandTortasCount = Math.ceil(tortasCount/2);
			var wastedTortasCount = Math.floor(tortasCount/2);
			tortasCount = 0;
			balance += wastedTortasCount * 9;
			balance += secondHandTortasCount * 10.5;
		}
		else {
			balance += tortasCount * 16;
			tortasCount = 0;
			balance -= (tortasCountDemand - tortasCount) * 5;
		}
	}
	return balance;
}

function getIndexOfMaxBalance(balances) {
	var currentMaxIndex = 0;
	for (var i = 1; i < balances.length; i++) {
		if (balances[currentMaxIndex].balance < balances[i].balance)
			currentMaxIndex = i;
	}
	return currentMaxIndex;
}

function main() {
	var results = [];
	for (var i = 1; i <= 6; i++) {
		results.push({balance: runSimulations(i, 5000), dozensProduced: i});
	}
	console.log(results);
	console.log(results[getIndexOfMaxBalance(results)].dozensProduced + " dozens per day maximizes profit after 5000 days.");
}

main();

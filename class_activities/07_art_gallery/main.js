function getPriceForDay(day) {
	switch (day) {
		case 1:
			return 400000;
		case 2:
			return 300000;
		case 3:
			return 260000;
		default:
			return 0;
	}
}

function isPaintingAvailableAtDay(day) {
	if (day > 3) return false;
	var random = Math.random();
	return random < Math.pow(0.6, day);
}

function getEarningForTheDayBuyingOnDay(day) {
	if (isPaintingAvailableAtDay(day)) return 500000 - getPriceForDay(day);
	else return 0;
}

function getAccumulatedEarningsForBuyingOnDay(numOfDays, day) {
	var accumulated = 0;
	for (var i = 0; i < numOfDays; i++) {
		accumulated += getEarningForTheDayBuyingOnDay(day);
	}
	return accumulated;
}

function main() {
	var earningsForDays = [];
	for (var i = 1; i < 4; ++i) {
		earningsForDays.push(getAccumulatedEarningsForBuyingOnDay(5000, i));
	}
	for (var i = 0; i < earningsForDays.length; ++i) {
		var earningForDay = earningsForDays[i];
		console.log(`The earnings for buying in the day number ${i + 1} are ${earningsForDays[i]}.`);
	}
}

main();

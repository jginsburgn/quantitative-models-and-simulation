function inInterval(value, lowerInclusive, upperExclusive) {
	return lowerInclusive <= value && value < upperExclusive;
}

function getTransportExpenses() {
	var random = Math.random();
	if (random, 0, 1/6) return 1300;
	if (random, 1/6, 2/6) return 1800;
	if (random, 2/6, 3/6) return 2300;
	if (random, 3/6, 4/6) return 2800;
	if (random, 4/6, 5/6) return 3300;
	if (random, 5/6, 6/6) return 3800;
}

function getDayBalance(putAsidePercentage) {
	var balance = 3000;
	var transport = getTransportExpenses();
	balance -= transport;
	var putAside = putAsidePercentage * balance;
	balance -= putAside;
	if (balance >= 0) {
		balance *= .60;
	}
	balance += putAside;
	return balance;
}

function getAccumulatedBalanceAfterDays(daysCount, putAsidePercentage) {
	var balance = 0;
	for (var i = 0; i < daysCount; ++i) {
		balance += getDayBalance(putAsidePercentage);
	}
	return balance;
}

function main() {
	for (var percentage = 0; percentage <= 1; percentage += 0.01) {
		console.log(`Part put apart ${percentage}, final balance: ${getAccumulatedBalanceAfterDays(5000, percentage)}`);
	}
}

main();

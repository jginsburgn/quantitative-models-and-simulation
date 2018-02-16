function inInterval(value, lowerInclusive, upperExclusive) {
	return lowerInclusive <= value && value < upperExclusive;
}

function getInterArrivalTime() {
	var random = Math.random();
	if (inInterval(random, 0, 20/100)) return 1;
	if (inInterval(random, 0, 45/100)) return 2;
	if (inInterval(random, 0, 75/100)) return 3;
	if (inInterval(random, 0, 90/100)) return 4;
	if (inInterval(random, 0, 100/100)) return 5;
}

function getServiceTime() {
	var random = Math.random();
	if (inInterval(random, 0, 10/100)) return 1;
	if (inInterval(random, 0, 25/100)) return 2;
	if (inInterval(random, 0, 60/100)) return 3;
	if (inInterval(random, 0, 75/100)) return 4;
	if (inInterval(random, 0, 90/100)) return 5;
	if (inInterval(random, 0, 100/100)) return 6;
}

function day(context) {
	var queuedCustomers = 0;
	var interArrivalTimeLeft = getInterArrivalTime();
	// Each minute in day
	for (var minute = 0; minute < context.minutesInDay; minute++) {
		// Receive new customers into queue, if applicable
		if (interArrivalTimeLeft == 0) {
			interArrivalTimeLeft = getInterArrivalTime();
			queuedCustomers++;
		}
		else interArrivalTimeLeft--;
		// Advance queue customers to free service windows
		for (var serviceWindow of context.serviceWindows) {
			// If window free get queued customer
			if (serviceWindow.timeLeft <= 0) {
				if (queuedCustomers > 0) {
					serviceWindow.timeLeft = getServiceTime();
					queuedCustomers--;
				}
			}
			// Reduce time left for customer in busy window
			else {
				serviceWindow.timeLeft--;
			}
		}
		// Charge for customers in queue
		context.costs += queuedCustomers;
	}
}

function a() {
	var context = {};
	context.minutesInDay = 60;
	context.costs = 0;
	context.serviceWindows = [{timeLeft: 0}];
	day(context);
	console.log(`The costs for running a single window for one hour is ${context.costs}, ignoring any window construction costs and employee fees.`);
}

function b() {
	var context = {};
	context.minutesInDay = 60;
	context.costs = 0;
	context.serviceWindows = [{timeLeft: 0}, {timeLeft:0}];
	day(context);
	console.log(`The costs for running a single window for one hour is ${context.costs}, ignoring any window construction costs and employee fees.`);
}

function c() {
	var context = {};
	context.minutesInDay = 60 * 7;
	context.costs = 0;
	context.serviceWindows = [{timeLeft: 0}];
	// Run simulations with one window
	for (var year = 0; year < 20; year++) {
		for (var dayCount = 0; dayCount < 200; dayCount++) {
			day(context);
			context.serviceWindows = [{timeLeft: 0}];
		}
		// Employee costs
		context.costs += 16000;
		// Amortized window building costs
		context.costs += 12000;
		console.log(`Costs for a single window at the end of year ${year + 1} are ${context.costs}.`);
	}
	// Run simulations with two windows
	context.costs = 0;
	context.serviceWindows = [{timeLeft: 0}, {timeLeft:0}];
	for (var year = 0; year < 20; year++) {
		for (var dayCount = 0; dayCount < 200; dayCount++) {
			day(context);
			context.serviceWindows = [{timeLeft: 0}, {timeLeft:0}];
		}
		// Employee costs
		context.costs += 16000 * 2;
		// Amortized window building costs
		context.costs += 20000;
		console.log(`Costs for two windows at the end of year ${year + 1} are ${context.costs}.`);
	}
}

function main() {
	console.log("Answer to point a");
	a();
	console.log("Answer to point b");
	b();
	console.log("Answer to point c");
	c();
}

main();

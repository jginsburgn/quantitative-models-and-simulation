var queuedOrders = {};
function inInterval(value, lowerInclusive, upperExclusive) {
	return lowerInclusive <= value && value < upperExclusive;
}
function getTodaysDemand() {
	var random = Math.random();
	if (inInterval(random, 0, 0.04)) return 0;
	if (inInterval(random, 0, 0.1)) return 1;
	if (inInterval(random, 0, 0.2)) return 2;
	if (inInterval(random, 0, 0.4)) return 3;
	if (inInterval(random, 0, 0.7)) return 4;
	if (inInterval(random, 0, 0.88)) return 5;
	if (inInterval(random, 0, 0.96)) return 6;
	if (inInterval(random, 0, 0.99)) return 7;
	if (inInterval(random, 0, 1)) return 8;
}
function deliveryDelay() {
	var random = Math.random();
	if (inInterval(random, 0, 0.25)) return 1;
	if (inInterval(random, 0, 0.75)) return 2;
	if (inInterval(random, 0, 0.95)) return 3;
	if (inInterval(random, 0, 1)) return 4;
}
function day(context) {
	// Place order if reordering day is today
	if (context.currentDay - 1 /*So that first order can happen on first day*/ % context.reorderInterval == 0) {
		queuedOrders[context.currentDay + deliveryDelay()] = 15;
	}
	// Sell as many as demanded and report costly deficits
	var todaysDemand = getTodaysDemand();
	var difference = context.stock - todaysDemand;
	if (difference >= 0) context.stock -= difference;
	else {
		context.costs -= difference * context.missingStockCost;
		context.stock = 0;
	}
	// Receive orders delivered today
	if (queuedOrders[context.currentDay] != undefined) {
		context.stock += queuedOrders[context.currentDay];
		delete queuedOrders[context.currentDay];
	}
	// Check maximum amount of stock of year
	if (context.maxStock < context.stock) context.maxStock = context.stock;
	// On year reset max stock and add stock keeping costs
	if (context.currentDay % context.lengthOfYear == 0) {
		context.costs += context.maxStock * context.stockKeepingCost;
		context.maxStock = 0;
	}
}

function main() {
	var context = {};
	for (context.reorderInterval = 1; context.reorderInterval <= 5; ++context.reorderInterval) {
		context.currentDay = 1;
		context.stock = 0;
		context.lengthOfYear = 200;
		context.maxStock = 0;
		context.costs = 0;
		context.stockKeepingCost = 26;
		context.missingStockCost = 25;
		context.orderCost = 50;
		for (; context.currentDay <= 200; context.currentDay++) {
			day(context);
		}
		console.log(`For a reorder interval of ${context.reorderInterval} days, the cost was: ${context.costs}.`);
	}
}	

main();

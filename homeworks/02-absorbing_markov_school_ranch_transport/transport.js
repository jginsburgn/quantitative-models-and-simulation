function run() {
	var currentState = "a";
	var costs = 0;
	while (["finished", "discarded"].indexOf(currentState) == -1) {
		var rand = Math.random();
		switch (currentState) {
			case "a":
				costs += 30;
				currentState = rand < 0.93 ? "ia" : "discarded";
				break;
			case "ia":
				costs += 2.5;
				if (rand < 0.04) currentState = "a";
				else if (rand < 0.98) currentState = "b";
				else currentState = "discarded";
				break;
			case "b":
				costs += 25;
				if (rand < 0.95) currentState = "ib";
				else currentState = "discarded";
				break;
			case "ib":
				costs += 2.5;
				if (rand < 0.03) currentState = "b";
				else if (rand < 0.99) currentState = "c";
				else currentState = "discarded";
				break;
			case "c":
				costs += 18;
				if (rand < 0.97) currentState = "ic";
				else currentState = "discarded";
				break;
			case "ic":
				costs += 2.5;
				if (rand < 0.01) currentState = "c";
				else if (rand < 0.99) currentState = "finished";
				else currentState = "discarded";
				break;
		}
	}
	if (currentState == "finished") costs += 0.8;
	return {state: currentState, costs};
}

function main() {
	var finishedProducts = 0;
	var totalCosts = 0;
	var totalProducts = 0;
	while (finishedProducts < 1000) {
		var result = run();
		totalProducts++;
		if (result.state == "finished") finishedProducts++;
		totalCosts += result.costs;
	}
	return {totalCosts, totalProducts};
}

function mainMain() {
	var costAvg = 0;
	var prodAvg = 0;
	for (let i of new Array(1000)){
		var res = main();
		costAvg += res.totalCosts;
		prodAvg += res.totalProducts;
	}
	costAvg /= 1000;
	prodAvg /= 1000;
	console.log(costAvg, prodAvg);
}

mainMain();

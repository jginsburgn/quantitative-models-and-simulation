function minuteOfArrival() {
	return Math.round(Math.random() * 60);
}

function main() {
	var timesMet = 0;
	for (var i = 0; i < 1000000; ++i) {
		var him = minuteOfArrival();
		var her = minuteOfArrival();
		if ((Math.abs(him - her) <= 15) || (Math.abs(him - her) <= 20 && him <= her)) timesMet++;
	}
	console.log(timesMet/1000000);
}

main();

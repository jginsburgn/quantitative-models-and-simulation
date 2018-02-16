var PD = require("probability-distributions");

var teams = [
	{name: "Germany", meanGoalTime: 48, meanGoalInPenalty: 0.58, nextGoal: 0, totalWins: 0},
	{name: "Portugal", meanGoalTime: 53, meanGoalInPenalty: 0.40, nextGoal: 0, totalWins: 0},
	{name: "Argentina", meanGoalTime: 50, meanGoalInPenalty: 0.55, nextGoal: 0, totalWins: 0},
	{name: "Brazil", meanGoalTime: 48, meanGoalInPenalty: 0.48, nextGoal: 0, totalWins: 0}
];

function timeBetweenGoals(team) {
	return Math.round(PD.rexp(1, 1/team.meanGoalTime)[0]);	
}

function goalInPenalty(team) {
	return Math.random() < team.meanGoalInPenalty;
}

function indexOfTeam(name, ts) {
	var i = 0;
	for (var team of ts) {
		if (name == team.name) return i;
		i++;
	}
}

function getRandomElement(arr) {
	var retVal = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
	return retVal;
}

function match(teamA, teamB) {
	var currentTime = 0;
	// Goal counts
	var goalsOfA = 0;
	var goalsOfB = 0;
	// Get initial goal times
	teamA.nextGoal = timeBetweenGoals(teamA);
	teamB.nextGoal = timeBetweenGoals(teamB);
	// Regular play time
	while (currentTime <= 90) {
		if (teamA.nextGoal == currentTime) {
			goalsOfA++;
			teamA.nextGoal += timeBetweenGoals(teamA);
		}
		if (teamB.nextGoal == currentTime) {
			goalsOfB++;
			teamB.nextGoal += timeBetweenGoals(teamB);
		}
		if (teamB.nextGoal < teamA.nextGoal) {
			currentTime = teamB.nextGoal;
		}
		else {
			currentTime = teamB.nextGoal;
		}
	}
	// Check for winners
	if (goalsOfA < goalsOfB) return teamB.name;
	if (goalsOfB < goalsOfA) return teamA.name;
	// Extra time
	while (currentTime <= 120) {
		if (teamA.nextGoal == currentTime) {
			goalsOfA++;
			teamA.nextGoal += timeBetweenGoals(teamA);
		}
		if (teamB.nextGoal == currentTime) {
			goalsOfB++;
			teamB.nextGoal += timeBetweenGoals(teamB);
		}
		if (teamB.nextGoal < teamA.nextGoal) {
			currentTime = teamB.nextGoal;
		}
		else {
			currentTime = teamB.nextGoal;
		}
	}
	// Check for winners
	if (goalsOfA < goalsOfB) return teamB.name;
	if (goalsOfB < goalsOfA) return teamA.name;
	// Penalties
	for (var penalty = 0; penalty < 5; penalty++) {
		goalsOfA += goalInPenalty(teamA) ? 1 : 0;
		goalsOfB += goalInPenalty(teamB) ? 1 : 0;
	}
	// Check for winners
	if (goalsOfA < goalsOfB) return teamB.name;
	if (goalsOfB < goalsOfA) return teamA.name;
	// Tie breaker
	while (true) {
		goalsOfA += goalInPenalty(teamA) ? 1 : 0;
		goalsOfB += goalInPenalty(teamB) ? 1 : 0;
		// Check for winners
		if (goalsOfA < goalsOfB) return teamB.name;
		if (goalsOfB < goalsOfA) return teamA.name;
	}
}

function tournament() {
	var teamsLocal = teams.slice();
	var winnerFirst = match(getRandomElement(teamsLocal), getRandomElement(teamsLocal));
	var winnerSecond = match(getRandomElement(teamsLocal), getRandomElement(teamsLocal));
	var firstWinner = teams[indexOfTeam(winnerFirst, teams)];
	var secondWinner = teams[indexOfTeam(winnerSecond, teams)];
	var winner = match(firstWinner, secondWinner);
	teams[indexOfTeam(winner, teams)].totalWins++;
}

function reportResults() {
	for (var team of teams) {
		console.log(`${team.name} had a total of ${team.totalWins} wins.`);
	}
}

function main() {
	for (var i = 0; i < 5000; ++i) {
		tournament();
	}
	reportResults();
}

main();

function drawGrid(context, horizontalTicks, verticalTicks, horizontalInitial = 0, verticalInitial = 0) {
	var width = context.canvas.width;
	var height = context.canvas.height;
	var horizontalStep = width / horizontalTicks;
	var verticalStep = height / verticalTicks;
	for (var i = 0; i <= horizontalTicks; ++i) {
		context.beginPath();
		var constantCoordinate = horizontalInitial + i * horizontalStep;
		context.moveTo(0, constantCoordinate);
		context.lineTo(width, constantCoordinate);
		context.stroke();
	}
	for (var i = 0; i <= horizontalTicks; ++i) {
		context.beginPath();
		var constantCoordinate = verticalInitial + i * verticalStep;
		context.moveTo(constantCoordinate, 0);
		context.lineTo(constantCoordinate, height);
		context.stroke();
	}
	//Draw center
	context.beginPath();
	context.arc(width/2, height/2, horizontalStep/2, 0, Math.PI * 2);
	context.fill();
}

//Low inclusive, high exclusive
function randomInteger(high, low = 0) {
	return Math.floor(Math.random() * (high - low)) + low;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function walkRandom(context, initX, initY, horizontalStepSize, verticalStepSize, steps) {
	context.beginPath();
	context.moveTo(initX, initY);
	var currentPoint = {X: initX, Y: initY};
	for (var i = 0; i < steps; ++i) {
		var cardinality = Math.floor(Math.random() * 4);
		switch (cardinality) {
			case 0: //North
				currentPoint.Y -= verticalStepSize;
				break;
			case 1: //South
				currentPoint.Y += verticalStepSize;
				break;
			case 2: //East
				currentPoint.X += horizontalStepSize;
				break;
			case 3: //West
				currentPoint.X -= horizontalStepSize;
				break;
		}
		reportStep(cardinality);
		context.lineTo(currentPoint.X, currentPoint.Y);
		context.stroke();
		var parsedDelay = parseInt(document.getElementById("animation-delay").value);
		var delay = parsedDelay || parsedDelay == 0 ? parsedDelay : 100;
		await sleep(delay);
	}
	context.beginPath();
	context.arc(currentPoint.X, currentPoint.Y, horizontalStepSize/3, 0, Math.PI * 2);
	context.fill();
	reportWalkStop(currentPoint);
	return currentPoint;
}

function distanceInSteps(A, B, horizontalStepSize, verticalStepSize) {
	return Math.round(Math.abs(A.X-B.X)/horizontalStepSize) + Math.round(Math.abs(A.Y-B.Y)/verticalStepSize);
}

function distanceFromCenter(endpoint) {
	var parsedSteps = parseInt(document.getElementById("steps").value);
	var steps = parsedSteps ? parsedSteps : 10;
	var canvas = document.getElementById("glCanvas");
	var width = canvas.width;
	var height = canvas.height;
	var horizontalStep = width/(2 * steps + 1);
	var verticalStep = width/(2 * steps + 1);
	var origin = {X: parseInt(width/2), Y: parseInt(height/2)};
	var distance = distanceInSteps(origin, endpoint, horizontalStep, verticalStep);
	return distance;
}

function reportWalkStop(position) {
	var parsedBorderLimit = parseInt(document.getElementById("border-max").value);
	var borderLimit = parsedBorderLimit || parsedBorderLimit == 0 ? parsedBorderLimit : 2;
	executedSimulations++;
	var distance = distanceFromCenter(position);
	var resultText = distance <= borderLimit ? "Success (" + distance + ")" : "Failure (" + distance + ")";
	currentSimulationReport.insertBefore(document.createTextNode(resultText), currentSimulationReport.firstChild);
	var resultNode = document.getElementById("result");
	if (distance <= borderLimit) successesCount++;
	resultNode.innerText = successesCount/executedSimulations;
}

function cardinalityFromInteger(integer) {
	switch (integer) {
		case 0:
			return "North";
			break;
		case 1:
			return "South";
			break;
		case 2:
			return "East";
			break;
		case 3:
			return "West";
			break;
	}
}

function reportStep(cardinality) {
	var newLI = document.createElement("li");
	currentSimulationReport.appendChild(newLI);
	newLI.appendChild(document.createTextNode(cardinalityFromInteger(cardinality)));
}

function clearGrid(context) {
	var width = context.canvas.width;
	var height = context.canvas.height;
	var horizontalStep = width/21;
	var verticalStep = width/21;	
}

async function main() {
	if (running) return;
	running = true;
	successesCount = 0;
	executedSimulations = 0;
	const canvas = document.querySelector("#glCanvas");
	var reportNode = document.getElementById("report");
	while (reportNode.childNodes.length != 0) {
		reportNode.removeChild(reportNode.childNodes[0]);
	}
	var parsedSteps = parseInt(document.getElementById("steps").value);
	var steps = parsedSteps ? parsedSteps : 10;
	// Initialize the GL context
	const context = canvas.getContext("2d");
	var width = context.canvas.width;
	var height = context.canvas.height;
	var horizontalStep = width/(2 * steps + 1);
	var verticalStep = width/(2 * steps + 1);
	// Only continue if WebGL is available and working
	if (!context) {
		alert("Unable to initialze WebGL. Your browser or machine may not support it.");
		return;
	}
	context.clearRect(0, 0, width, height);
	context.lineWidth = 1;
	context.strokeStyle = "rgb(0, 0, 0)";
	context.fillStyle = "rgb(0, 0, 0)";
	drawGrid(context, (2 * steps + 1), (2 * steps + 1), horizontalStep/2, verticalStep/2);
	context.lineWidth = horizontalStep/4;
	context.lineCap = "round";
	var parsedSimulationCount = parseInt(document.getElementById("simulations").value);
	var simulationCount = parsedSimulationCount ? parsedSimulationCount : 10;
	
	for (var i = 0; i < simulationCount; ++i) {
		var simulationColor = "rgb(" + randomInteger(256) + "," + randomInteger(256) + "," + randomInteger(256) + ")"
		var currentSimulationLI = document.createElement("li");
		document.getElementById("report").appendChild(currentSimulationLI);
		currentSimulationReport = document.createElement("ol");
		currentSimulationReport.style.cssText = "color: " + simulationColor;
		currentSimulationLI.appendChild(currentSimulationReport);
		context.strokeStyle = simulationColor;
		context.fillStyle = context.strokeStyle;
		await walkRandom(context, width/2, height/2, horizontalStep, verticalStep, steps);
	}
	running = false;
}

running = false;
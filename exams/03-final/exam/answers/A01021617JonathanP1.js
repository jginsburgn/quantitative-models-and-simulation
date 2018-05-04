const minutesOfOperation = 60 * 6;

const timeBetweenCalls = [
  [0.10, 6],
  [0.11, 1],
  [0.21, 2],
  [0.22, 3],
  [0.20, 4],
  [0.16, 5],
];

const timeToProcessCalls = [
  [0.20, 1],
  [0.19, 2],
  [0.18, 3],
  [0.17, 4],
  [0.13, 5],
  [0.10, 6],
  [0.03, 7],
];

const timeBetweenCallsWithCampaign = [
  [0.22, 1],
  [0.25, 2],
  [0.19, 3],
  [0.15, 4],
  [0.12, 5],
  [0.07, 6],
];

function* inverseTransform(intervalsAndVariables) {
  function checkIntervalsAndVariables(iandvs) {
    var acc = 0;
    for (var iandv of iandvs) {
      acc += iandv[0];
    }
    if (acc != 1) throw new Error("The intervals and variables given for the inverse transform are wrong, as probabilities should add up to one.");
  }
  checkIntervalsAndVariables(intervalsAndVariables);
  function getVariable(randomNumber) {
    for (var iandv of intervalsAndVariables) {
      if (randomNumber < iandv[0]) return iandv[1];
      else randomNumber -= iandv[0];
    }
  }
  while (true) {
    yield getVariable(Math.random());
  }
}

var tbcg = inverseTransform(timeBetweenCalls);
var ttpcg = inverseTransform(timeToProcessCalls);
var tbcwc = inverseTransform(timeBetweenCallsWithCampaign);

function getIndexOfEarliestAvailableEmployee(employees) {
  var earliestTime = Infinity;
  var earliestAvailableEmployee = -1;
  for (var i = 0; i < employees.length; ++i) {
    if (employees[i] < earliestTime) {
      earliestTime = employees[i];
      earliestAvailableEmployee = i;
    }
  }
  return earliestAvailableEmployee;
}

function getAverageTimeWaiting(numberOfEmployees, timeBetweenCallsGenerator) {
  var employees = [];
  for (var i = 0; i < numberOfEmployees; ++i) {
    employees.push(0);
  }
  var customerQueue = [0];
  while (true) {
    var timeOfArrivalOfNextCustomer = timeBetweenCallsGenerator.next().value + customerQueue[customerQueue.length - 1];
    if (timeOfArrivalOfNextCustomer > minutesOfOperation) break;
    else customerQueue.push(timeOfArrivalOfNextCustomer);
  }
  var servicedCustomers = [];
  while (customerQueue.length != 0) {
    var ioeae = getIndexOfEarliestAvailableEmployee(employees);
    var ttpc = ttpcg.next().value;
    servicedCustomers.push(employees[ioeae] - customerQueue.shift());
    employees[ioeae] += ttpc;
  }
  return servicedCustomers.reduce((acc, cur) => { return acc + cur; }, 0)/servicedCustomers.length;
}

function main() {
  const numberOfDays = 5000;
  var averageTimeWaiting = 0;
  var averageTimeWaitingWithTwoEmployees = 0;
  var averageTimeWaitingWithCampaign = 0;
  var averageTimeWaitingWithCampaignAndTwoEmployees = 0;
  for (var i = 0; i < numberOfDays; i++) {
    averageTimeWaiting += getAverageTimeWaiting(1, tbcg);
    averageTimeWaitingWithTwoEmployees += getAverageTimeWaiting(2, tbcg);
    averageTimeWaitingWithCampaign += getAverageTimeWaiting(1, tbcwc);
    averageTimeWaitingWithCampaignAndTwoEmployees += getAverageTimeWaiting(2, tbcwc);
  }
    averageTimeWaiting /= numberOfDays;
    averageTimeWaitingWithTwoEmployees /= numberOfDays;
    averageTimeWaitingWithCampaign /= numberOfDays;
    averageTimeWaitingWithCampaignAndTwoEmployees /= numberOfDays;
    console.log(`El tiempo de espera promedio de un cliente con un agente y sin campaña es de: ${averageTimeWaiting}.`);
    console.log(`El tiempo de espera promedio de un cliente con dos agentes y sin campaña es de: ${averageTimeWaitingWithTwoEmployees}.`);
    console.log(`El tiempo de espera promedio de un cliente con un agente y con campaña es de: ${averageTimeWaitingWithCampaign}.`);
    console.log(`El tiempo de espera promedio de un cliente con dos agente y con campaña es de: ${averageTimeWaitingWithCampaignAndTwoEmployees}.`);
    console.log("Tiempos de espera negativos significan que en realidad el agente o agentes estuvieron esperando la llegada de llamadas de clientes. Como se observa, no es necesario contratar otro agente en ninguno de los casos excepto cuando se tenga una campaña exitosa como la mostrada; en este caso, valdría la pena incluso pensar en una campaña más agresiva ya que se tendrían agentes poco ocupados (cuarto caso).");
}

main();
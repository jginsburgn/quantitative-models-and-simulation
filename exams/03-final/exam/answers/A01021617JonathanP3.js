const timeBetweenFailuresWithOnePenChanged = [
  [0.05, 10],
  [0.15, 20],
  [0.15, 30],
  [0.20, 40],
  [0.20, 50],
  [0.15, 60],
  [0.10, 70],
];

const timeBetweenFailuresWithAllPensChanged = [
  [0.15, 100],
  [0.25, 110],
  [0.35, 120],
  [0.20, 130],
  [0.05, 140],
];

const RNForOnePenChanged = [0.47, 0.03, 0.11, 0.10, 0.67, 0.23, 0.89, 0.62, 0.56, 0.74];
const RNForAllPensChanged = [0.99, 0.29, 0.27, 0.75, 0.89, 0.78, 0.68, 0.64, 0.62, 0.30];

function* inverseTransform(intervalsAndVariables, randomNumbers) {
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
  for (var rn of randomNumbers) {
    yield getVariable(rn);
  }
  return;
}

var tbfwopcg = inverseTransform(timeBetweenFailuresWithOnePenChanged, RNForOnePenChanged);
var tbfwapcg = inverseTransform(timeBetweenFailuresWithAllPensChanged, RNForAllPensChanged);

function getCostsAndHoursPassed(costPerRepair, generator) {
  var currentHour = 0;
  var currentCost = 0;
  while (true) {
    var lapseToNextRepair = generator.next();
    if (lapseToNextRepair.done) break;
    currentHour += lapseToNextRepair.value;
    currentCost += costPerRepair;
  }
  return {costs: currentCost, hoursPassed: currentHour};
}

function main() {
  var cahpOnePen = getCostsAndHoursPassed(1 /*Number of hours to repair*/ * 50 /*Cost per hour of useless machine*/ + 1 /*Number of pens to replace*/ * 8 /*Cost per pen*/, tbfwopcg);
  var cahpAllPens = getCostsAndHoursPassed(2 * 50 + 4 * 8, tbfwapcg);
  console.log(`Considerando 10 fallas, los costos en el primer esquema fueron ${cahpOnePen.costs}, al haber pasado ${cahpOnePen.hoursPassed} horas. Por otro lado, los costos en el segundo esquema fueron ${cahpAllPens.costs}, al haber pasado ${cahpAllPens.hoursPassed} horas. Por lo que aproximadamente se gasta ${cahpOnePen.costs/cahpOnePen.hoursPassed} por hora en el primer esquema y ${cahpAllPens.costs/cahpAllPens.hoursPassed} por hora en el segundo esquema. Lo cual nos permite concluir que es mejor reemplazar las cuatro plumas al ocurrir la falla de alguna en una máquina (segundo esquema).`);
}

main();
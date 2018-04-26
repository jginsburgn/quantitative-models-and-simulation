const fs = require("fs");

function* NormalDistributionVariableGenerator() {
  while (true) yield Math.random();
}

function* PoissonDistributionVariableGenerator(lambda) {
  var currentIndex = 0;
  var pi = 1;
  var ndvg = NormalDistributionVariableGenerator();
  var currentRandomValue = ndvg.next();
  while (!currentRandomValue.done) {
    var testValue = currentRandomValue.value * pi;
    if (testValue < Math.exp(-lambda)) {
      yield currentIndex;
      pi = 1;
      currentIndex = 0;
    }
    else {
      pi = testValue;
      currentIndex++;
    }
    currentRandomValue = ndvg.next();
  }
}

function main(lambda) {
  var pdvg = PoissonDistributionVariableGenerator(lambda);
  var values = [];
  for (var i = 0; i < 5000; ++i) {
    values.push(pdvg.next().value);
  }
  var max = Math.max(...values);
  var frequencies = {};
  for (var i = 0; i <= max; ++i) {
    frequencies[i.toString()] = 0;
  }
  for (var value of values) {
    frequencies[value.toString()]++;
  }
  var XLSXChart = require ("xlsx-chart");
  var xlsxChart = new XLSXChart ();
  var fields = Object.keys(frequencies);
  var data = {};
  data.Frequencies = frequencies;
  var opts = {
    file: "chart.xlsx",
    chart: "column",
    titles: [
      "Frequencies"
    ],
    fields,
    data
  };
  xlsxChart.generate (opts, function (err, data) {
    if (err) {
      console.error (err);
    } else {
      fs.writeFileSync (opts.file, data);
      console.log ("File: ", opts.file);
    };
  });
}

main(4);
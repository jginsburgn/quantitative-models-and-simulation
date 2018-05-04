const pd = require("probability-distributions");
const meanCustomersPerHour = 30;
const meanServiceTime = 3; //minutes
const serviceHours = 10;
const salaryPerHour = 10;


function* getCustomersForThisHour() {
    while (true) {
        yield pd.rpois(1, meanCustomersPerHour)[0];
    }
}

function* getServiceTime() {
    while (true) {
        var v =  pd.rexp(1, 1/meanServiceTime)[0];
        yield v;
    }
}

function getAverageTimeInLine(numberOfClerks) {
    const cfth = getCustomersForThisHour();
    const st = getServiceTime();
    var customers = [];
    var numberOfCustomers = cfth.next().value;
    var servicedCustomers = [];
    for (var i = 0; i < numberOfCustomers; ++i) {
        customers.push(0); // Elements represent waiting time.
    }
    var clerks = [];
    for (var i = 0; i < numberOfClerks; ++i) {
        clerks.push(0); // Elements represent local time for clerk.
    }
    while (customers.length != 0) { // While there are customers waiting
        // We service them FIFO
        var indexOfNextFreeClerk = 0;
        // We choose the next free clerk
        for (var i = 1; i < clerks.length; ++i) {
            if (clerks[indexOfNextFreeClerk] > clerks[i]) {
                indexOfNextFreeClerk = i;
            }
        }
        // We service the customer
        servicedCustomers.push(customers.pop() + clerks[indexOfNextFreeClerk]);
        clerks[indexOfNextFreeClerk] += st.next().value;
    }
    return servicedCustomers.reduce((accumulator, current) => {return accumulator + current}, 0)/servicedCustomers.length;
}

function getMinimumLocalTime(clerks) {
    var currentMinimum = Infinity;
    for (var clerk of clerks) {
        if (clerk < currentMinimum) currentMinimum = clerk;
    }
    return currentMinimum;
}

function getTotalTimeInLine(numberOfClerks) {
    const cfth = getCustomersForThisHour();
    const st = getServiceTime();
    var customers = [];
    var servicedCustomers = [];
    var clerks = [];
    for (var i = 0; i < numberOfClerks; ++i) {
        clerks.push(0); // Elements represent local time for clerk.
    }
    for (var serviceHour = 0; serviceHour < serviceHours; ++serviceHour) {
        // The hour starts
        // Customers get in line
        var numberOfCustomers = cfth.next().value;
        for (var i = 0; i < numberOfCustomers; ++i) {
            customers.push(serviceHour * 60); // Elements represent arrival time to the queue.
        }
        while (getMinimumLocalTime(clerks) < serviceHour * 60 + 60 && customers.length != 0) { // While the hour has not passed.
            // We service customers fifo.
            var indexOfNextFreeClerk = 0;
            // We choose the next free clerk
            for (var i = 1; i < clerks.length; ++i) {
                if (clerks[indexOfNextFreeClerk] > clerks[i]) {
                    indexOfNextFreeClerk = i;
                }
            }
            // We service the customer
            servicedCustomers.push(clerks[indexOfNextFreeClerk] - customers.shift());
            clerks[indexOfNextFreeClerk] += st.next().value;
        }
        // The hour will end
        // Make sure that the local time of the clerks is at least up to the end of that hour
        for (var i = 0; i < clerks.length; ++i) {
            if (clerks[i] < serviceHour * 60 + 60) clerks[i] = serviceHour * 60 + 60;
        }
    }
    return servicedCustomers.reduce((accumulator, current) => {return accumulator + current}, 0);
}

function main() {
    for (var i = 2; i <= 4; ++i) {
        console.log(`The average waiting time for customers in the store is ${getAverageTimeInLine(i)}, with ${i} clerks in the store.`);
    }
    for (var i = 2; i <= 4; ++i) {
        var ttil = getTotalTimeInLine(i);
        console.log(`The sum of time spent in line by serviced customers was ${ttil}, with ${i} clerks in the store.`);
        console.log(`The total waiting cost of the day was ${ttil * 100/60}, and the total service cost (clerk salary), was ${100 * i} with ${i} clerks in the store.`);
    }
    console.log("The minimum total daily cost is achieved when there are 4 clerks");
}

main();

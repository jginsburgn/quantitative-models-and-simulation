function* getRandomArrivals() {
    let initials = [37, 77, 13, 10, 2, 18, 31, 19, 32, 85, 31, 94, 81, 43, 31, 58, 33, 51];
    let counter = 0;
    while (true) {
        if (counter < initials.length) {
            yield initials[counter++] / 100;
        }
        else yield Math.random();
    }
}

function* getRandomUnloadRate() {
    let initials = [69, 84, 12, 94, 51, 36, 17, 2, 15, 29, 16, 52, 56, 43, 26, 22, 8, 62];
    let counter = 0;
    while (true) {
        if (counter < initials.length) {
            yield initials[counter++] / 100;
        }
        else yield Math.random();
    }
}

function* numberOfArrivals () {
    let random = getRandomArrivals();
    while (true) {
        let value = random.next().value;
        if (value < 0.13) yield 0;
        else if (value < 0.30) yield 1;
        else if (value < 0.45) yield 2;
        else if (value < 0.7) yield 3;
        else if (value < 0.9) yield 4;
        else yield 5;
    }
}

function* rateOfUnloading () {
    let random = getRandomUnloadRate();
    while (true) {
        let value = random.next().value;
        if (value < 0.05) yield 1;
        else if (value < 0.2) yield 2;
        else if (value < 0.7) yield 3;
        else if (value < 0.9) yield 4;
        else yield 5;
    }
}

function main(numOfDays) {
    let rou = rateOfUnloading();
    let noa = numberOfArrivals();
    let queueSize = 0;
    let unloadedShips = 0;
    let delayed = 0;
    let arrivalAccumulator = 0;
    for (let i = 0; i < numOfDays; ++i) {
        let arrivals = noa.next().value;
        arrivalAccumulator += arrivals;
        let rate = rou.next().value;
        if (queueSize > rate) {
            unloadedShips += rate;
            queueSize -= rate;
            rate = 0;
            queueSize += arrivals;
            delayed += arrivals;
        }
        else {
            let remaining = rate - queueSize;
            unloadedShips += queueSize;
            if (arrivals < remaining) {
                unloadedShips += arrivals;
            }
            else {
                unloadedShips += remaining;
                arrivals -= remaining;
                delayed += arrivals;
                queueSize += arrivals;
            }
        }
    }
    console.log(`Average daily delays: ${delayed/numOfDays}.`);
    console.log(`Average daily arrivals: ${arrivalAccumulator/numOfDays}.`);
    console.log(`Average daily unloads: ${unloadedShips/numOfDays}.`);
}

main(15);
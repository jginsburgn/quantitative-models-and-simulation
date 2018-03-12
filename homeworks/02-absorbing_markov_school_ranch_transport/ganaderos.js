let ceroAcien = 1; // Los que pesan 0-100 kg
let cienAdosCientos = 0; // Los que pesan 100-200 kg
let dosCientosMas = 0; // Los que pesan 200+ kg
let muertos = 0;
let ganancias = 0;
const numIteraciones = 1000;

let años = 0;

for (let i = 0; i < numIteraciones; i += 1) {
    ceroAcien = 1;
    cienAdosCientos = 0;
    dosCientosMas = 0;

    while (ceroAcien || cienAdosCientos || dosCientosMas) {
        años += 1;

        // Animales que pesan 200+
        let temp = dosCientosMas;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.60) { // 60% de los animales se venden a 10,000
                dosCientosMas -= 1;
                ganancias += 10000;
            } else if (rand < 0.80) { // 20% se venden a $20,000
                dosCientosMas -= 1;
                ganancias += 20000;
            } else if (rand < 0.81) { // 1% mueren
                dosCientosMas -= 1;
                muertos += 1;
            }
        }

        // Animales que pesan 100-200 kg
        temp = cienAdosCientos;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.20) { // 20% se venden a $3,000
                cienAdosCientos -= 1;
                ganancias += 3000;
            } else if (rand < 0.70) { // 50% se venden a $5,000
                cienAdosCientos -= 1;
                ganancias += 5000;
            } else if (rand < 0.90) { // 20% Mueren
                muertos += 1;
            } else { // 10% engorgan a siguiente nivel
                cienAdosCientos -= 1;
                dosCientosMas += 1;
            }
        }

        // Animales que pesan 0-100 kg
        temp = ceroAcien;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.05) { // 5% mueren
                ceroAcien -= 1;
                muertos += 1;
            } else if (rand < 0.15) { // 10% se venden a $2,000
                ceroAcien -= 1;
                ganancias += 2000;
            } else if (rand < 0.70) { // 55% pasan al siguiente rango
                ceroAcien -= 1;
                cienAdosCientos += 1;
            } // 30% se quedan en 1
        }
    }
}

console.log('Años promedio: ', (años / numIteraciones).toFixed(2));
console.log(`Animales Muertos: ${muertos}/${numIteraciones} = %${muertos / numIteraciones}`);
console.log(`Ganacia Promedio: $${ganancias / numIteraciones}`);

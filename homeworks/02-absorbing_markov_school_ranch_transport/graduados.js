let alumnos1 = 1; // Primer Ingreso
let alumnos2 = 0; // Nivel Intermedio
let alumnos3 = 0; // Nivel Avanzado
let alumnos4 = 0; // Nivel Final
let alumnos5 = 0; // Deserciones
let alumnos6 = 0; // Graduados
const numIteraciones = 20000;

let años = 0;

for (let i = 0; i < numIteraciones; i += 1) {
    alumnos1 = 1;
    alumnos2 = 0;
    alumnos3 = 0;
    alumnos4 = 0;
    while (alumnos1 || alumnos2 || alumnos3 || alumnos4) {
        años += 1;

        // Nivel Final
        let temp = alumnos4;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.85) { // 85% se graduan
                alumnos4 -= 1;
                alumnos6 += 1;
            } else if (rand < 0.90) { // 5% desertan
                alumnos4 -= 1;
                alumnos5 += 1;
            } // 10% se quedan en 4
        }

        // Nivel Avanzado
        temp = alumnos3;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.80) { // 80% pasan a 4
                alumnos3 -= 1;
                alumnos4 += 1;
            } else if (rand < 0.85) { // 5% desertan
                alumnos3 -= 1;
                alumnos5 += 1;
            } // 15% se quedan en 3
        }

        // Nivel Intermedio
        temp = alumnos2;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.85) { // 85% pasan a 3
                alumnos2 -= 1;
                alumnos3 += 1;
            } else if (rand < 0.9) { // 5% desertan
                alumnos2 -= 1;
                alumnos5 += 1;
            } // 10% se quedan en 2
        }

        // Alumnos de primer ingreso
        temp = alumnos1;
        for (let j = 0; j < temp; j += 1) {
            const rand = Math.random();
            if (rand < 0.8) { // 80% pasan a 2
                alumnos1 -= 1;
                alumnos2 += 1;
            } else if (rand < 0.9) { // 10% desertan
                alumnos1 -= 1;
                alumnos5 += 1;
            } // 10% se quedan en 1
        }
    }
}

console.log('Años promedio para graduarse: ', (años / alumnos6).toFixed(2));
console.log(`Alumnos Graduados ${alumnos6}/${numIteraciones} = %${alumnos6 / numIteraciones}`);
console.log(`Alumnos que Desertaron ${alumnos5}/${numIteraciones} = ${alumnos5 / numIteraciones}`);

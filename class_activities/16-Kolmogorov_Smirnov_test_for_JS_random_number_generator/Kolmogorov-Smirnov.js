const size = 16;
const cardsCount = 1000;
const cardsList = [];
const matrix = [];

while (cardsList.length < cardsCount) {
    const card = Math.floor(Math.random() * Math.pow(10, 16));
    cardsList.push(card.toLocaleString("en-us", {minimumIntegerDigits: 16}).replace(/,/g, ""));
}

cardsList.sort();

// arI -> Ri
// iOverN -> i/N
// dPlus -> D+
// dMinus -> D-
for (let i = 0; i < cardsCount; ++i) {
    matrix[i] = {};
    matrix[i].arI = parseInt(cardsList[i], 10) / (10 ** size);
    matrix[i].iOverN = (i + 1) / cardsCount;
    matrix[i].dPlus = matrix[i].iOverN - matrix[i].arI;
    matrix[i].dMinus = matrix[i].arI - (i / 1000);
}

const dPlus = matrix.reduce((acc, cur) => {
    if (cur.dPlus > acc) return cur.dPlus;
    return acc;
}, 0);

const dMinus = matrix.reduce((acc, cur) => {
    if (cur.dMinus > acc) return cur.dMinus;
    return acc;
}, 0);

const max = dPlus > dMinus ? dPlus : dMinus;
const test = 1.36 / Math.sqrt(cardsCount);

console.log('Max D+ / D-:', max);
console.log('Test Value:', test);

if (max < test) console.log('Test passed.');
else console.log('Test failed.');

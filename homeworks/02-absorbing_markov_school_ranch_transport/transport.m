disp("En total deben entrar el siguiente número de articulos");
matrixA = [
		0		1		0		0		0		0		0		0		0;
		0		0		0.93	0		0		0		0		0		0.07;
		0		0.04	0		0.94	0		0		0		0		0.02;
		0		0		0		0		0.95	0		0		0		0.05;
		0		0		0		0.03	0		0.96	0		0		0.01;
		0		0		0		0		0		0		0.97	0		0.03;
		0		0		0		0		0		0.01	0		0.98	0.01;
		0		0		0		0		0		0		0		1		0;
		0		0		0		0		0		0		0		0		1;		
];
matrixB = [
		0		30		0		0		0		0		0		0		0;
		0		0		2.325	0		0		0		0		0		0;
		0		1.2		0		23.5	0		0		0		0		0;
		0		0		0		0		2.375	0		0		0		0;
		0		0		0		0.75	0		17.28	0		0		0;
		0		0		0		0		0		0		2.425	0		0;
		0		0		0		0		0		0.18	0		0.784	0;
		0		0		0		0		0		0		0		0		0;
		0		0		0		0		0		0		0		0		0;		
];
entrada = [1222 0 0 0 0 0 0 0 0];
costs = [0 0 0 0 0 0 0 0 0];
for i = 1:1000
		costs += entrada*matrixB;
		entrada *= matrixA;
endfor
sum(costs)
harvis = 	[0.8 0.1 0.1
			0.2 0.7 0.1
			0.25 0.15 0.6];
disp("Los autos se entregarán por sucursal NS, WE, SU respectivamente:");
disp(([100, 80, 60]* harvis^1));

computers= 	[0.8 0.1 0.1
			0.05 0.9 0.05
			0.2 0.1 0.7];
disp("Las computadoras compradas anualmente por marca D, B, K respectivamente serán (X100):");
disp((600 * computers^100)(1,:));

printing = 	[0.8 0.1 0.1
			0.2	0.7	0.1
			0.2 0.2 0.6];
disp("La matriz de transicion de las marcas (H, P, G respectivamente) de impresión es:");
disp(printing);
disp("No podrá alcanzar su meta. Las participaciones de las marcas a largo plazo se muestran en seguida en el mismo orden que la matríz de transición, mostrada antes. Printing House permanecerá en el mercado a largo plazo.");
disp((printing^100)(1,:));
function [] = main()
	for i = 1:5000
	[pN, mI, mC] = simulate(1E-16);
	disp(i);
	disp("El número de iteraciones para obtener convergencia fue: "), disp(pN);
	disp("La matríz inicial fue: "), disp(mI);
	disp("La matríz de convergencia fue: "), disp(mC);
	endfor
endfunction

function [pN, mI, mC] = simulate(tolerance)
	pN = 0;
	mI = generateMarkovMatrix();
	mC = mI;
	lastMatrix = mI;
	do
		pN++;
		lastMatrix *= mI;
		difference = mC - lastMatrix;
		difference .*= difference;
		mC = lastMatrix;
	until (sum(sum(difference)) < tolerance)
endfunction

function [retVal] = generateMarkovMatrix(n = 3, m = 3) 
	retVal = rand(n, m);
	for i = 1:rows(retVal)
		rowSum = sum(retVal(i,:));
		for j = 1:columns(retVal)
			retVal(i, j) /= rowSum; 
		endfor
	endfor
endfunction

main()
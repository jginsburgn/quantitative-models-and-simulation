function [] = main()
	transitionMatrix = [
		0	.2	0	0	.8;
		0	0	.1	0	.9;
		0	0	0	.15	.85;
		0	0	0	1	0;
		0	0	0	0	1;
	];
	limitingMatrix = transitionMatrix^1000;
	badDebtsPercentage = limitingMatrix(1, 4);
	paidInFullPercentage = limitingMatrix(1, 5);
	initialAmount = 150000;
	disp(initialAmount * badDebtsPercentage), disp("will become bad debt and"), disp(initialAmount * paidInFullPercentage), disp("will paid in full.")
endfunction
% States: Current, 1 mth overdue, 2 mths overdue, bad debts, paid in full
main()

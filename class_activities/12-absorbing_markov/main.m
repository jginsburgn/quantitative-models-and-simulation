P = [1 0 0 0; 0 1 0 0; 0.6 0 0.1 0.3; 0.3 0.3 0.2 0.2]^100;
disp("Los números de alumnos que aprueban y reprueban respectivamente son:");
disp(round([50 30]*P(3:4, 1:2)));

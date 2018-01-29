//
//  Probabilidad.hpp
//  Colas
//
//  Created by Sebastián Galguera and Jonathan Ginsburg on 1/26/18.
//  Copyright © 2018 Sebastián Galguera and Jonathan Ginsburg. All rights reserved.
//

#ifndef Probabilidad_hpp
#define Probabilidad_hpp

double calcularCantidadDeCamionesPorDia(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.50){
        return 0;
    }
    if(probabilidad >= 0.50 && probabilidad < 0.75){
        return 1;
    }
    if(probabilidad >= 0.75 && probabilidad < 0.90){
        return 2;
    }
    if(probabilidad >= 0.90 && probabilidad < 1){
        return 3;
    }
    return 0;
}


double timeOfNextArrival(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.02){
        return 20;
    }
    if(probabilidad >= 0.02 && probabilidad < 0.10){
        return 25;
    }
    if(probabilidad >= 0.10 && probabilidad < 0.22){
        return 30;
    }
    if(probabilidad >= 0.22 && probabilidad < 0.47){
        return 35;
    }
    if(probabilidad >= 0.47 && probabilidad < 0.67){
        return 40;
    }
    if(probabilidad >= 0.67 && probabilidad < 0.82){
        return 45;
    }
    if(probabilidad >= 0.82 && probabilidad < 0.92){
        return 50;
    }
    if(probabilidad >= 0.92 && probabilidad < 0.97){
        return 55;
    }
    if(probabilidad >= 0.97 && probabilidad < 1){
        return 60;
    }
    return 0;
}

////////
//3 PERSONAS
////////

double tiempoDeServicio3Personas(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.05){
        return 20;
    }
    if(probabilidad >= 0.05 && probabilidad < 0.15){
        return 25;
    }
    if(probabilidad >= 0.15 && probabilidad < 0.35){
        return 30;
    }
    if(probabilidad >= 0.35 && probabilidad < 0.60){
        return 35;
    }
    if(probabilidad >= 0.60 && probabilidad < 0.72){
        return 40;
    }
    if(probabilidad >= 0.72 && probabilidad < 0.82){
        return 45;
    }
    if(probabilidad >= 0.82 && probabilidad < 0.90){
        return 50;
    }
    if(probabilidad >= 0.90 && probabilidad < 0.96){
        return 55;
    }
    if(probabilidad >= 0.96 && probabilidad < 1){
        return 60;
    }
    return 0;
}

////////
//4 PERSONAS
////////

double tiempoDeServicio4Personas(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.05){
        return 15;
    }
    if(probabilidad >= 0.05 && probabilidad < 0.20){
        return 20;
    }
    if(probabilidad >= 0.20 && probabilidad < 0.40){
        return 25;
    }
    if(probabilidad >= 0.40 && probabilidad < 0.60){
        return 30;
    }
    if(probabilidad >= 0.60 && probabilidad < 0.75){
        return 35;
    }
    if(probabilidad >= 0.75 && probabilidad < 0.87){
        return 40;
    }
    if(probabilidad >= 0.87 && probabilidad < 0.95){
        return 45;
    }
    if(probabilidad >= 0.95 && probabilidad < 0.99){
        return 50;
    }
    if(probabilidad >= 0.99 && probabilidad < 1){
        return 55;
    }
    return 0;
}

////////
//5 PERSONAS
////////

double tiempoDeServicio5Personas(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.10){
        return 10;
    }
    if(probabilidad >= 0.10 && probabilidad < 0.28){
        return 15;
    }
    if(probabilidad >= 0.28 && probabilidad < 0.50){
        return 20;
    }
    if(probabilidad >= 0.50 && probabilidad < 0.68){
        return 25;
    }
    if(probabilidad >= 0.68 && probabilidad < 0.78){
        return 30;
    }
    if(probabilidad >= 0.78 && probabilidad < 0.86){
        return 35;
    }
    if(probabilidad >= 0.86 && probabilidad < 0.92){
        return 40;
    }
    if(probabilidad >= 0.92 && probabilidad < 0.97){
        return 45;
    }
    if(probabilidad >= 0.97 && probabilidad < 1){
        return 50;
    }
    return 0;
}

////////
//6 PERSONAS
////////
double tiempoDeServicio6Personas(double probabilidad){
    if(probabilidad >= 0.00 && probabilidad < 0.12){
        return 10;
    }
    if(probabilidad >= 0.12 && probabilidad < 0.27){
        return 15;
    }
    if(probabilidad >= 0.27 && probabilidad < 0.53){
        return 20;
    }
    if(probabilidad >= 0.53 && probabilidad < 0.68){
        return 25;
    }
    if(probabilidad >= 0.68 && probabilidad < 0.80){
        return 30;
    }
    if(probabilidad >= 0.80 && probabilidad < 0.88){
        return 35;
    }
    if(probabilidad >= 0.88 && probabilidad < 0.94){
        return 40;
    }
    if(probabilidad >= 0.94 && probabilidad < 0.98){
        return 45;
    }
    if(probabilidad >= 0.98 && probabilidad < 1){
        return 50;
    }
    return 0;
}

#endif /* Probabilidad_hpp */

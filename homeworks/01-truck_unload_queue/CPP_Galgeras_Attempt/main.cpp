//
//  main.c
//  Colas
//
//  Created by Sebastián Galguera and Jonathan Ginsburg on 1/26/18.
//  Copyright © 2018 Sebastián Galguera and Jonathan Ginsburg. All rights reserved.
//

#include <stdio.h>
#include "Queue.hpp"
#include "Probabilidad.hpp"
#include "Event.hpp"

void printTime(int timeConsumed){
    if((timeConsumed%60) == 0 ||(timeConsumed%60) < 10)
        std::cout << timeConsumed/60 << ":0" << timeConsumed%60 << std::endl;
    else
        std::cout << timeConsumed/60 << ":" << timeConsumed%60 << std::endl;
}

double probsOfArrival3[] = {0.0, 0.48355, 0.98977, 0.06533, 0.45128, 0.15486, 0.19241, 0.15997, 0.6794, 0.90872, 0.58997, 0.68691,0.73488, 0.23423, 0.86675};

double probServiceTime3[] = {0.83761, 0.14387, 0.51321, 0.72472, 0.05466, 0.84609, 0.29735, 0.59076, 0.76355, 0.29549, 0.61958,0.17267, 0.10061, 0.45645, 0.86754};

double probsOfArrival4[] = {0.68971, 0.18477, 0.14707, 0.83745, 0.1693, 0.20368, 0.41196, 0.66919, 0.35352, 0.79982, 0.4685, 0.69248, 0.04013, 0.45645, 0.86786};

double probServiceTime4[] = {0.11403, 0.65622, 0.93997, 0.22567, 0.33361, 0.07126, 0.3748, 0.31678, 0.54131, 0.68416, 0.52326, 0.9346, 0.31792, 0.87315, 0.64564, 0.4545};

int main(int argc, const char * argv[]) {
    // insert code here...
    Queue<Event *> * storeQueue = new Queue<Event *>;
    
    // Variable para iniciar el horario
    double generalClock = 660;
    // Calcular siguiente camión
    double nextArrival = probsOfArrival3[0];
    // Convertir a hora
    double hourOfNextArrival = generalClock + nextArrival;
    // Checar la duración del evento
    double durationOfEvent = tiempoDeServicio3Personas(probServiceTime3[0]);
    // Bandera para saber que comieron y no se repita la regla
    bool hadLunch = 0;
    // Costo de tener los camiones en cola
    double queueCost = 0.0;
    // Costo de que el staff no esté trabajando
    double staffNotWorkingCost = 0.0;
    
    printTime(hourOfNextArrival);
    
    // Crear evento base
    Event * e = new Event("Truck Arrived");
    e->timeOfArrival = hourOfNextArrival;
    e->timeOfEventStart = hourOfNextArrival;
    e->durationOfEvent = durationOfEvent;
    e->timeOfEventEnd = e->timeOfEventStart + e->durationOfEvent;
    e->printEvent();
    
    // Instalarlo como previo
    Event * previous = e;
    
    // Calcular probabilidad del tiempo de llegada del próximo evento
    nextArrival = timeOfNextArrival(probsOfArrival3[1]);
    hourOfNextArrival += nextArrival;
    printTime(hourOfNextArrival);
    
    for(int i = 1; i < 16; i++){
        // Comenzar con siguiente evento
        std::cout << "\nBUS NUMBER " << i+1 << std::endl;
        // Calcular la duración del evento
        durationOfEvent = tiempoDeServicio3Personas(probServiceTime3[i]);
        
        // Si la hora de arrival del evento actual (no se ha actualizad) llega antes de que concluya el evento anterior
        if(hourOfNextArrival < previous->timeOfEventEnd){
            // Enters the queue to-do
            std::cout << "STAFF ARE FULL" << std::endl;
            // Se crea un nuevo evento
            e = new Event("Truck Arrived");
            // El tiempo de llegada es la hora que se calculó
            e->timeOfArrival = hourOfNextArrival;
            // El evento empieza cuando el anterior acaba
            e->timeOfEventStart = previous->timeOfEventEnd;
            // La duración del evento se calculó atrás
            e->durationOfEvent = durationOfEvent;
            // El evento acaba con la suma del tiempo de comienzo y el de la duración
            e->timeOfEventEnd = e->timeOfEventStart + e->durationOfEvent;
            e->printEvent();
            // El tiempo que se gasta en la cola es la diferencial entre el comienzo y la llegada
            e->timeWastedInQueue = e->timeOfEventStart - e->timeOfArrival;
            std::cout << "Time wasted in queue : ";
            printTime(e->timeWastedInQueue);
            // Aumenta el costo de la cola en horas
            queueCost += e->timeWastedInQueue;
        }else{
            // Doesn't enter the queue
            // Si el camión llega después de que se acabó el servicio o al mismo tiempo
            e = new Event("Truck Arrived");
            // Llega cuando se calculó
            e->timeOfArrival = hourOfNextArrival;
            // Empieza cuando llega
            e->timeOfEventStart = e->timeOfArrival;
            // Dura lo que se calculó
            e->durationOfEvent = durationOfEvent;
            // Concluye cuando comienza + la duración
            e->timeOfEventEnd = e->timeOfEventStart + e->durationOfEvent;
            // El tiempo gastado por el personal es el tiempo de llegada - el tiempo de acabado del anterior
            e->timeWastedByStaff = e->timeOfArrival - previous->timeOfEventEnd;
            e->printEvent();
            std::cout << "Time wasted by staff : ";
            printTime(e->timeWastedByStaff);
            // Merma de tiempo
            staffNotWorkingCost += e->timeWastedByStaff;
        }

        // El evento actual se vuelve el anterior | la variable previous toma la dirección del actual
        previous = e;
        // Se calcula la próxima llegada
        nextArrival = timeOfNextArrival(probsOfArrival3[i+1]);
        hourOfNextArrival += nextArrival;
        printTime(hourOfNextArrival);
        
        // Para la hora de la comida
        if(hourOfNextArrival >= 900 && e->timeOfEventEnd <= 900 && !hadLunch){
            // Si el siguiente camión llega después de las 3
            // Si el camión actual acaba antes de las 3
            // Se empuja un evento nuevo llamado LunchTime
            std::cout << "Hora del lunch" << std::endl;
            e = new Event("Lunch time");
            // La comida automáticamente comienza a las 3
            e->timeOfArrival = 900;
            e->timeOfEventStart = 900;
            e->durationOfEvent = 30;
            e->timeOfEventEnd = e->timeOfEventStart + e->durationOfEvent;
            e->printEvent();
            
            printTime(hourOfNextArrival);
            // Se convierte en el evento previo
            previous = e;
            // Se activa la bandera de que se comió para que no se repita por la condición
            hadLunch = 1;
        }else if(e->timeOfEventEnd >= 900 && !hadLunch){
            // Si el siguiente camión llega después de las 3
            // Si el camión actual termina después de las 3
            std::cout << "Hora del lunch" << std::endl;
            // Se crea un evento de tipo LunchTime
            e = new Event("Lunch time");
            // El tiempo de llegada es igual al tiempo de fin del evento anterior
            e->timeOfArrival = previous->timeOfEventEnd;
            // El evento comienza cuando terminó el evento anterior porque se considera que "llega" automáticamente, no hay offset
            e->timeOfEventStart = previous->timeOfEventEnd;
            // Dura 30 minutos de comida
            e->durationOfEvent = 30;
            e->timeOfEventEnd = e->timeOfEventStart + e->durationOfEvent;
            e->printEvent();
            // Se convierte en el evento previo
            previous = e;
            printTime(hourOfNextArrival);
            hadLunch = 1;
        }
    }

    // Tiempo total es cuando terminó menos cuando empezó
    double totalTime = previous->timeOfEventEnd - 660;
    printTime(totalTime);
    // El costo extra son las horas que trabajaron entre 60 * 37.5
    double extraTimeCost = ((previous->timeOfEventEnd - 1170)/60)*37.5;
    double normalTimeCost = (480/60)*25;
    std::cout << "Extra time Cost : " << extraTimeCost << std::endl;
    std::cout << "Normal time Cost : " << normalTimeCost << std::endl;
    std::cout << "Warehouse time Cost : " << (totalTime/60)*500 << std::endl;
    std::cout << "Trucks in Queue Cost : " << (queueCost/60)*100 << std::endl;
    std::cout << "Cost Lost in Staff Work : " << (staffNotWorkingCost/60)*25 << std::endl;
    // No se suma el Cost Lost in Staff Work porque ya está considerado en el total
    double totalCost  = extraTimeCost + normalTimeCost + (totalTime/60)*500 + (queueCost/60)*100;
    std::cout << "Total Cost : " << totalCost << std::endl;
    
    
    /*
     time of arrival current = time of arrival del anterior + calcula tiempo entre llegada
     time of event start = time of event end del anterior
     duracion = tiempodeservicio3personas
     
     */
  
    return 0;
}

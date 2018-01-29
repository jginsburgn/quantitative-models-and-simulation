//
//  Event.h
//  Colas
//
//  Created by Sebastián Galguera and Jonathan Ginsburg on 1/26/18.
//  Copyright © 2018 Sebastián Galguera and Jonathan Ginsburg. All rights reserved.
//

#ifndef Event_hpp
#define Event_hpp

class Event{
public:
    // Member Variables
    std::string eventType;
    // Tiempo que dura el evento
    double durationOfEvent = 0.0;
    // Tiempo global del día en el que llega el evento
    double timeOfArrival = 0.0;
    // Tiempo global del día en el que empieza el evento
    double timeOfEventStart = 0.0;
    // Tiempo global del día en el que termina el evento
    double timeOfEventEnd = 0.0;
    // Número de eventos inhabilitados
    double lockedEvents = 0.0;
    // Time wasted in queue
    double timeWastedInQueue = 0.0;
    // Time wasted by staff
    double timeWastedByStaff = 0.0;
public:
    // Constructor
    Event(std::string eventType){
        this->eventType = eventType;
        
    }
    ~Event(){};
    
    void printEvent(){
        std::cout << "\n-----------------------------" << std::endl;
        std::cout << "EVENT WITH TYPE : " << "\"" << this->eventType << "\"";
        std::cout << "\n-----------------------------" << std::endl;
        std::cout << "Time the truck arrives : ";
        printTime(this->timeOfArrival);
        std::cout << "Time the service starts : ";
        printTime(this->timeOfEventStart);
        std::cout << "Duration of Service : ";
        printTime(this->durationOfEvent);
        std::cout << "Time the service will end : ";
        printTime(this->timeOfEventEnd);
    };

    void printTime(int timeConsumed){
        if((timeConsumed%60) == 0)
            std::cout << timeConsumed/60 << ":0" << timeConsumed%60 << std::endl;
        else
            std::cout << timeConsumed/60 << ":" << timeConsumed%60 << std::endl;
    }
    
};


#endif /* Event_hpp */

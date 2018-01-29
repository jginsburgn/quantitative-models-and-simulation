//
//  Queue.h
//  Colas
//
//  Created by Sebastián Galguera and Jonathan Ginsburg on 1/26/18.
//  Copyright © 2018 Sebastián Galguera and Jonathan Ginsburg. All rights reserved.
//

#ifndef Queue_hpp
#define Queue_hpp

#include "LinkedList.hpp"
template <class T>
class Queue: private LinkedList<T>{
public:
    Queue(){};
    ~Queue(){};
    void enqueue(const T & content){
        LinkedList<T>::insertBack(content);
    };
    Node<T> * dequeue(){
        return LinkedList<T>::removeFront();
    };
    Node<T> * showFront(){
        return LinkedList<T>::at(0);
    };
    int size(){
        return LinkedList<T>::size();
    };
};

#endif /* Queue_hpp */

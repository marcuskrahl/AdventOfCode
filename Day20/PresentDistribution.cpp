#include "PresentDistribution.hpp"

unsigned long presents_in_house(unsigned long house_number) {
    unsigned long presents = 10;
    if (house_number > 1) {
        presents += house_number * 10;
    }
    for (unsigned long i = 2; i <= (house_number/2); i++) {
        if ((house_number % i) == 0) {
            presents += i * 10;
        }
    }
    return presents;
}

unsigned long presents_in_house2(unsigned long house_number) {
    unsigned long presents = house_number*11; 
    for (unsigned long i = 1; i <= (house_number/2); i++) {
        if (50*i < house_number) {
            continue;
        }
        if ((house_number % i) == 0) {
            presents += i * 11;
        }
    }
    return presents;
}

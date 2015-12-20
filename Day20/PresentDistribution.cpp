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


#include <iostream>
#include <string>

#include "PresentDistribution.hpp"

void run_part_one() {
    unsigned long presents = 0;
    unsigned long house = 1;
    do {
        house++;
        presents = presents_in_house(house);
    } while (presents < 34000000);
    std::cout << house << std::endl;
}
void run_part_two() {
    unsigned long presents = 0;
    unsigned long house = 1;
    do {
        house++;
        presents = presents_in_house2(house);
    } while (presents < 34000000);
    std::cout << house << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day20 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

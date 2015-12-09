#include <iostream>
#include <string>

#include "RouteCalculation.hpp"

void run_part_one() {
    std::string line;
    RouteCalculation route_calculation;
    while (std::getline(std::cin,line)) {
        route_calculation.add_connection(line);
    }
    std::cout << route_calculation.get_shortest_route() << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day9 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

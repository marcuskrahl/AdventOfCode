#include <iostream>
#include <string>

#include "Seating.hpp"

void run_part_one() {
    std::string line;
    SeatingPlan plan;
    while(std::getline(std::cin, line)) {
        plan.add_rule(Seating::from_string(line));
    }
    std::cout << plan.get_maximum_happiness() << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day13 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

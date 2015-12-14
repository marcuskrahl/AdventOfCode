#include <iostream>
#include <string>

#include "Reindeer.hpp"

void run_part_one() {
    unsigned int max_distance = 0;
    std::string line;
    while(std::getline(std::cin,line)) {
        unsigned int travelled_distance = Reindeer::from_string(line).get_distance_after_seconds(2503);
        if (travelled_distance > max_distance) {
            max_distance = travelled_distance;
        }
    }
    std::cout << max_distance << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day14 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

#include <iostream>
#include <string>

#include "Containers.hpp"
#include <vector>

void run_part_one() {
    std::vector<unsigned int> containers;
    unsigned int container_value;
    while (std::cin >> container_value) {
        containers.push_back(container_value);
    }
    std::cout << get_number_of_combinations(containers, 150) << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day17 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

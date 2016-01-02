#include <iostream>
#include <string>

#include "Packaging.hpp"

void run_part_one() {
    std::string line;
    std::vector<unsigned int> packages;
    while (std::getline(std::cin,line)) {
        packages.push_back(std::stol(line));
    }
    std::cout << get_minimum_entaglement(packages,3) << std::endl;
}
void run_part_two() {
    std::string line;
    std::vector<unsigned int> packages;
    while (std::getline(std::cin,line)) {
        packages.push_back(std::stol(line));
    }
    std::cout << get_minimum_entaglement(packages,4) << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day24 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

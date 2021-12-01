#include <iostream>
#include <string>

#include "Aunt.hpp"

void run_part_one() {
    std::string line;
    int aunt_pos = 1;
    Aunt target_aunt("Sue 1: children: 3, cats: 7, samoyeds: 2, pomeranians: 3, akitas: 0, vizslas: 0, goldfish: 5, trees: 3, cars: 2, perfumes: 1");
    while(std::getline(std::cin,line)) {
        if (Aunt(line) == target_aunt) {
            break;
        }
        aunt_pos++;
    }
    std::cout << aunt_pos << std::endl;
}
void run_part_two() {
    std::string line;
    int aunt_pos = 1;
    Aunt target_aunt("Sue 1: children: 3, cats: 7, samoyeds: 2, pomeranians: 3, akitas: 0, vizslas: 0, goldfish: 5, trees: 3, cars: 2, perfumes: 1");
    while(std::getline(std::cin,line)) {
        if (Aunt(line).range_equals(target_aunt)) {
            break;
        }
        aunt_pos++;
    }
    std::cout << aunt_pos << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day16 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

#include <iostream>
#include <string>

#include "Replacement.hpp"
#include "MoleculeGenerator.hpp"

void run_part_one() {
    std::string line;
    MoleculeGenerator generator;
    while (std::getline(std::cin,line)) {
        if (line == "") {
            break;
        }
        generator.add_replacement(Replacement(line));
    }
    std::getline(std::cin,line);
    unsigned int result = generator.get_number_of_possible_results(line);
    std::cout << result << std::endl;
}
void run_part_two() {
    std::string line;
    MoleculeGenerator generator;
    while (std::getline(std::cin,line)) {
        if (line == "") {
            break;
        }
        generator.add_replacement(Replacement(line));
    }
    std::getline(std::cin,line);
    unsigned int result = generator.get_shortest_steps_to_target_molecule(line);
    std::cout << result << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day18 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

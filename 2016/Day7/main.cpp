#include <iostream>
#include <string>

#include "Circuit.hpp"

void run_part_one() {
    Circuit circuit;
    std::string command;
    while (std::getline(std::cin,command)) {
        std::cout << "parsed line " << command << std::endl;
        circuit.add_node(command);
    }
    std::cout << circuit.get_value("a") << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day6 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

#include <iostream>
#include <string>

#include "Instructions.hpp"
 
void run_part_one() {
    std::string line;
    InstructionRunner runner;
    std::array<int,REGISTER_COUNT> registers = {0,0};
    while(std::getline(std::cin,line)) {
        runner.add_instruction(parse_instruction(line));
    }
    runner.run(registers);
    std::cout<<registers[1]<<std::endl;
}
void run_part_two() {
    std::string line;
    InstructionRunner runner;
    std::array<int,REGISTER_COUNT> registers = {1,0};
    while(std::getline(std::cin,line)) {
        runner.add_instruction(parse_instruction(line));
    }
    runner.run(registers);
    std::cout<<registers[1]<<std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day23 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

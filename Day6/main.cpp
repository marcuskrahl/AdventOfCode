#include <iostream>
#include <string>

#include "LightCommand.hpp"
#include "LightMap.hpp"

void run_part_one() {
    LightMap light_map;
    std::string command;
    while (std::getline(std::cin,command)) {
        light_map.apply_command(*LightCommand::from_input(command));
    }
    std::cout << light_map.get_active_lights() << std::endl;
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

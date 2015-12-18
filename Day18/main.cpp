#include <iostream>
#include <string>

#include "LightMap.hpp"

void print_map(LightMap& light_map) {
    for (int y=0;y<100;y++) {
        for(int x=0;x<100;x++) {
            if (light_map.is_on(x,y)) {
                std::cout << '#';
            } else {
                std::cout << '.';
            }
        }
        std::cout << std::endl;
    }
}
void run_part_one() {
    std::string line;
    LightMap map(100,100);
    unsigned int current_line = 0;
    while (std::getline(std::cin,line)) {
        for (unsigned int i=0; i<100; i++) {
            if (line[i] == '#') {
                map.turn_on(i,current_line);
            }
        }
        current_line++;
    }
    for (unsigned int i = 0; i<100; i++) {
        map = map.evolve();
    }
    std::cout << map.get_active_lights() << std::endl;
}
void run_part_two() {
    std::string line;
    LightMap map(100,100);
    map.turn_on(0,0);
    map.turn_on(99,0);
    map.turn_on(99,99);
    map.turn_on(0,99);

    unsigned int current_line = 0;
    while (std::getline(std::cin,line)) {
        for (unsigned int i=0; i<100; i++) {
            if (line[i] == '#') {
                map.turn_on(i,current_line);
            }
        }
        current_line++;
    }
    for (unsigned int i = 0; i<100; i++) {
        map = map.corner_evolve();
    }
    std::cout << map.get_active_lights() << std::endl;
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

#include <iostream>
#include <string>

#include "SantaMap.hpp"

void run_part_one() {
    SantaMap map;
    char movement;
    while (std::cin>>movement) {
        map.move(movement);
    }
    std::cout << map.get_visited_houses() << std::endl;
}
void run_part_two() {
    SantaMap santas_map;
    SantaMap robots_map;
    char santas_movement;
    char robots_movement;
    while (std::cin>>santas_movement >> robots_movement) {
        santas_map.move(santas_movement);
        robots_map.move(robots_movement);
    }
    SantaMap combined_map(santas_map,robots_map);
    std::cout << combined_map.get_visited_houses() << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day3 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

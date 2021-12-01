#include <iostream>
#include <string>

#include "floor_functions.hpp"

void run_part_one() {
    std::string movement;
    std::cin >> movement;
    int final_floor = get_destination_floor(movement);
    std::cout << final_floor << std::endl;

}
void run_part_two() {
    std::string movement;
    std::cin >> movement;
    auto basement_entered_at = get_basement_position(movement);
    std::cout << basement_entered_at << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day1 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

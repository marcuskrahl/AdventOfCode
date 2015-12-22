#include <iostream>
#include <string>
 
#include "Spells.hpp"

void run_part_one() {
    std::cout << get_minimum_mana_to_win(58,9) << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day21 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

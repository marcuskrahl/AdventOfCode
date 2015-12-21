#include <iostream>
#include <string>
 
#include "BossFight.hpp"


void run_part_one() {
    std::cout << find_lowest_gold_to_win(100,8,2) << std::endl;
}
void run_part_two() {
    std::cout << find_lowest_gold_to_lose(100,8,2) << std::endl;
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

#include <iostream>
#include <string>

#include "md5.hpp"

void run_part_one() {
    std::cout << find_lowest_zeroes_value("ckczppom",5) << std::endl;
}
void run_part_two() {
    std::cout << find_lowest_zeroes_value("ckczppom",6) << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day4 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

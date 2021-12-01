#include <iostream>
#include <string>

#include "wrapping_paper_functions.hpp"

void run_part_one() {
    unsigned int area_sum = 0;
    std::string dimensions;
    while (std::cin >> dimensions) {
        Present present(dimensions);
        unsigned int area = calculate_wrapping_paper_area(present);
        std::cout << area << std::endl;
        area_sum += area;
    }
    std::cout << area_sum << std::endl;

}
void run_part_two() {
    unsigned int total_length = 0;
    std::string dimensions;
    while (std::cin >> dimensions) {
        Present present(dimensions);
        unsigned int length = calculate_ribbon_length(present);
        std::cout << length << std::endl;
        total_length += length;
    }
    std::cout << total_length << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day2 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

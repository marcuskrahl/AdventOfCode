#include <iostream>
#include <string>

#include "JSONAnalysis.hpp"

void run_part_one() {
    std::string json_string;
    std::cin >> json_string;
    std::cout << get_sum_of_numbers(json_string) << std::endl;
}
void run_part_two() {
    std::string json_string;
    std::cin >> json_string;
    std::cout << get_sum_of_numbers_without_red(json_string) << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day12 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

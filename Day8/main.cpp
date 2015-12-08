#include <iostream>
#include <string>

#include "Santa_StringLength.hpp"

void run_part_one() {
    std::string line;
    size_t total_difference = 0;
    while(std::getline(std::cin,line)) {
        total_difference += string_length(line) - memory_length(line);
    }
    std::cout << total_difference << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day8 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

#include <iostream>
#include <string>

#include "naughty_or_nice.hpp"

void run_part_one() {
    std::string word;
    unsigned int number_of_nice_words = 0;
    while (std::cin >> word) {
        if(is_nice(word)) {
            number_of_nice_words++;
        } 
    }
    std::cout << number_of_nice_words << std::endl;
}
void run_part_two() {
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

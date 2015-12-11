#include <iostream>
#include <string>

#include "PasswordGeneration.hpp"

void run_part_one() {
    std::string password = "cqjxjnds";
    do {
        password = increment_password(password);
    } while (!is_valid_password(password));
    std::cout << password << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day11 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

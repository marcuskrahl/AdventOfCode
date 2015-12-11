#include <iostream>
#include <string>

#include "PasswordGeneration.hpp"

std::string get_next_password(const std::string& password) {
    std::string tmp = password;
    do {
        tmp = increment_password(tmp);
    } while (!is_valid_password(tmp));
    return tmp;
}
void run_part_one() {
    std::cout << get_next_password("cqjxjnds") << std::endl;
}
void run_part_two() {
    std::cout << get_next_password(get_next_password("cqjxjnds")) << std::endl;
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

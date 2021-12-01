#include <iostream>
#include <string>

#include "LookAndSay.hpp"

void run_part_one() {
    std::string value = "1113222113";
    for (unsigned int i = 0; i< 40; i++) {
        value = look_and_say(value);
    }
    std::cout << value.length() << std::endl;
}
void run_part_two() {
    std::string value = "1113222113";
    for (unsigned int i = 0; i< 50; i++) {
        value = look_and_say(value);
    }
    std::cout << value.length() << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day10 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

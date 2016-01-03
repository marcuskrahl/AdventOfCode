#include <iostream>
#include <string>

void run_part_one() {
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day25 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

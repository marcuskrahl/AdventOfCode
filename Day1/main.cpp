#include <iostream>
#include <string>

#include "floor_functions.hpp"

int main(int argc, char* argv[]) {
    std::string movement;
    std::cin >> movement;
    int final_floor = get_destination_floor(movement);
    std::cout << final_floor << std::endl;
    return 0;
}

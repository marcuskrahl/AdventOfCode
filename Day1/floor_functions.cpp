#include "floor_functions.hpp"

int get_destination_floor(std::string movement) {
    int floor = 0;
    for(const auto& c: movement) {
        if (c == '(') {
            floor++;
        } else if (c==')') {
            floor--;
        }
    }
    return floor;
}

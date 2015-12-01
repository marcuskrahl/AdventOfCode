#include "floor_functions.hpp"

void move_floor(int& current_floor, const char movement);

int get_destination_floor(const std::string movement) {
    int floor = 0;
    for(const auto c: movement) {
        move_floor(floor,c);
    }
    return floor;
}

size_t get_basement_position(const std::string movement) {
    int floor=0;
    for(size_t pos = 0; pos != movement.length(); pos++) {
        move_floor(floor,movement[pos]);
        if (floor == -1) {
            return pos+1;
        }
    }
    return 0;
}

void move_floor(int& current_floor, const char movement) {
    if (movement == '(') {
        current_floor++;
    } else if (movement==')') {
        current_floor--;
    }
}


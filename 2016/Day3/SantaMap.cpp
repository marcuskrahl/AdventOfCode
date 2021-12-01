#include "SantaMap.hpp"

SantaMap::SantaMap() {
    //implicitly visit first house
    map[pos_x][pos_y] = 1;
    number_of_visited_houses++;
}
SantaMap::SantaMap(const SantaMap& map1, const SantaMap& map2) {
    for (unsigned int x = 0; x < max_map_length; x++) {
        for(unsigned int y = 0; y < max_map_length; y++) {
            if ((map1.map[x][y] > 0) || (map2.map[x][y] > 0)) {
                number_of_visited_houses++;
                map[x][y] = 1;
            }
        }
    }
}

void SantaMap::move(const char movement) {
    switch(movement) {
        case '<': move_left(); break;
        case '^': move_up(); break;
        case '>': move_right(); break;
        case 'v': move_down(); break;
    }
    increment_counter_if_new_visited_house();
}

void SantaMap::move_up() {
    if (pos_y == 0) {
        throw "left map";
    }
    pos_y--;
}

void SantaMap::move_down() {
    if (pos_y == max_map_length) {
        throw "left map";
    }
    pos_y++;
}

void SantaMap::move_left() {
    if (pos_x == 0) {
        throw "left map";
    }
    pos_x--;
}

void SantaMap::move_right() {
    if (pos_x == max_map_length) {
        throw "left map";
    }
    pos_x++;
}

void SantaMap::increment_counter_if_new_visited_house() {
    if (map[pos_x][pos_y] == 0) {
        map[pos_x][pos_y] = 1;
        number_of_visited_houses++;
    }
}

unsigned int SantaMap::get_visited_houses() const {
    return number_of_visited_houses;
}

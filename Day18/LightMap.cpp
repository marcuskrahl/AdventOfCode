#include "LightMap.hpp"

LightMap::LightMap(unsigned int max_x, unsigned int max_y) : max_x(max_x), max_y(max_y) {
    map = std::vector<std::vector<unsigned char>>(max_x,std::vector<unsigned char>(max_y,0));
}

bool LightMap::is_on(unsigned int x, unsigned int y) const {
    return map[x][y] > 0;
}

void LightMap::turn_on(unsigned int x, unsigned int y) {
    map[x][y] = 1;
}

void LightMap::turn_off(unsigned int x, unsigned int y) {
    map[x][y] = 0;
}

unsigned int LightMap::get_active_lights() const {
    unsigned int light_count = 0;
    for (unsigned int x = 0; x < max_x; x++) {
        for(unsigned int y = 0; y <max_y; y++) {
            if (is_on(x,y)) {
                light_count++;
            }
        }
    }
    return light_count;
}

LightMap LightMap::evolve() {
    LightMap result(max_x,max_y);
    for (unsigned int x = 0; x < max_x; x++) {
        for (unsigned int y = 0; y < max_y; y++) {
            if ( (!is_on(x,y)) && should_be_turned_on(x,y)) {
                result.turn_on(x,y);
            }
            if ( (is_on(x,y)) && (!should_be_turned_off(x,y))) {
                result.turn_on(x,y);
            }
        }
    }
    return result;
}

bool LightMap::should_be_turned_off(unsigned int x, unsigned int y) {
    unsigned int number_of_on_neighbors = get_number_of_on_neighbors(x,y);
    return number_of_on_neighbors > 3 || number_of_on_neighbors < 2;
}

bool LightMap::should_be_turned_on(unsigned int x, unsigned int y) {
    unsigned int number_of_on_neighbors = get_number_of_on_neighbors(x,y);
    return number_of_on_neighbors == 3;
}

unsigned int LightMap::get_number_of_on_neighbors(unsigned int x, unsigned int y) {
    unsigned int number_of_on_neighbors = 0;
    for (short x_diff = (x == 0 ? 0 : -1); x_diff <= 1; x_diff++) {
        for (short y_diff = (y == 0 ? 0: -1); y_diff <= 1; y_diff++) {
           if ((x_diff == 0) && (y_diff==0)) {
                continue;
           }
           unsigned int target_x = x + x_diff;
           unsigned int target_y = y + y_diff;
           if ((target_x >= max_x) || (target_y >= max_y)) {
                continue;
           }
           if (is_on(target_x, target_y)) {
                number_of_on_neighbors++;
           }
        }
    }
    return number_of_on_neighbors;
}

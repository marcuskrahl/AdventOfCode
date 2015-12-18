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

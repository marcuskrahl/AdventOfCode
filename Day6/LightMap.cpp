#include "LightMap.hpp"

unsigned int LightMap::get_active_lights() const {
    unsigned int active_lights = 0;
    for (unsigned int i = 0; i < map.size(); i++) {
        for(unsigned int j = 0; j < map[i].size(); j++) {
            if (map[i][j] > 0 ) {
                active_lights++;
            }
        }
    }
    return active_lights;
}

void LightMap::apply_command(const LightCommand& command) {
    for (unsigned int i = command.get_start_x(); i<= command.get_end_x(); i++) {
        for (unsigned int j = command.get_start_y(); j <= command.get_end_y(); j++) {
            map[i][j] = command.perform(i,j,map[i][j]);
        }
    }
}

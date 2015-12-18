#ifndef LIGHT_MAP_HPP
#define LIGHT_MAP_HPP

#include <vector>

class LightMap {
    public:
        LightMap(unsigned int max_x, unsigned int max_y);
        bool is_on(unsigned int x, unsigned int y) const;
        void turn_on(unsigned int x, unsigned int y);
        void turn_off(unsigned int x, unsigned int y);
        unsigned int get_active_lights() const;
    private:
        std::vector<std::vector<unsigned char>> map;
        unsigned int max_x;
        unsigned int max_y;

};

#endif

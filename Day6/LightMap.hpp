#ifndef LIGHT_MAP_HPP
#define LIGHT_MAP_HPP

#include <array>

#include "LightCommand.hpp"

class LightMap {
    public:
        unsigned int get_active_lights() const;
        unsigned int get_brightness() const;
        void apply_command(const LightCommand& command);
    private:
        std::array<std::array<unsigned char, 1000>,1000> map = {{{{0}}}};
};

#endif

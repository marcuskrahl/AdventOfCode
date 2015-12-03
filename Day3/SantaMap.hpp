#ifndef SANTA_MAP_HPP
#define SANTA_MAP_HPP


#include <array>

class SantaMap {
    public:
        SantaMap();
        void move(const char movement);
        unsigned int get_visited_houses() const;
    private:
        static const unsigned int max_map_length = 1000;
        unsigned int pos_x = max_map_length/2;
        unsigned int pos_y = max_map_length/2;
        std::array<std::array<unsigned char,max_map_length>, max_map_length> map;
        unsigned int number_of_visited_houses = 0;
        void increment_counter_if_new_visited_house();
        void move_up();
        void move_left();
        void move_right();
        void move_down();

};


#endif

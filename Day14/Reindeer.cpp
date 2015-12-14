#include "Reindeer.hpp"

Reindeer::Reindeer(unsigned int speed, unsigned int fly_time, unsigned int rest_time) 
    : speed(speed), fly_time(fly_time), rest_time(rest_time) {
}

unsigned int Reindeer::get_distance_after_seconds(unsigned int seconds) {
    unsigned int travelled_kilometers = 0;
    unsigned int complete_intervals = seconds / (fly_time + rest_time);
    travelled_kilometers += complete_intervals * speed * fly_time;
    unsigned int rest = seconds % (fly_time + rest_time);
    if (rest < fly_time) {
        travelled_kilometers += speed*rest;
    } else {
        travelled_kilometers += speed*fly_time;
    }
    return travelled_kilometers;
}

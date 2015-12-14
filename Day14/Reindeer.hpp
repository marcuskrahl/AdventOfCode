#ifndef REINDEER_HPP
#define REINDEER_HPP

class Reindeer {
    public:
        Reindeer(unsigned int speed, unsigned int fly_time, unsigned int rest_time);
        unsigned int get_distance_after_seconds(unsigned int seconds);
    private:
        unsigned int speed;
        unsigned int fly_time;
        unsigned int rest_time;
};

#endif

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

#include "Reindeer.hpp"

void run_part_one() {
    unsigned int max_distance = 0;
    std::string line;
    while(std::getline(std::cin,line)) {
        unsigned int travelled_distance = Reindeer::from_string(line).get_distance_after_seconds(2503);
        if (travelled_distance > max_distance) {
            max_distance = travelled_distance;
        }
    }
    std::cout << max_distance << std::endl;
}
void run_part_two() {
    std::vector<Reindeer> reindeers;
    std::vector<int> scores;
    std::string line;
    while(std::getline(std::cin,line)) {
        auto reindeer = Reindeer::from_string(line);
        reindeers.push_back(reindeer);
        scores.push_back(0);
    }
    for (unsigned int seconds = 1; seconds <= 2503; seconds++) {
        unsigned int max_travelled_distance = 0;
        std::vector<int> max_indices;
        for(size_t i=0; i<reindeers.size();i++) {
            unsigned int travelled_distance = reindeers[i].get_distance_after_seconds(seconds);
            if (travelled_distance > max_travelled_distance) {
                max_travelled_distance = travelled_distance;
                max_indices.empty();
                max_indices.push_back(i);
            } else if (travelled_distance == max_travelled_distance) {
                max_indices.push_back(i);
            }
        }
        for (auto i: max_indices) {
            scores[i]++; 
        }
    }
    unsigned int max_score = *std::max_element(scores.begin(),scores.end());
    std::cout << max_score << std::endl;
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day14 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

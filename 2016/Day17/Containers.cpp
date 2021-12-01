#include "Containers.hpp"

#include <limits>

unsigned get_sub_number_of_combinations(std::vector<unsigned int>::const_iterator begin, const std::vector<unsigned int>::const_iterator end, unsigned int target_value, int current_depth, int target_depth) {
    current_depth++;
    if (current_depth > target_depth) {
        return 0;
    }
    unsigned int number_of_combinations = 0;
    if (begin == end) {
        return 0;
    }
    for (auto it = begin; it != end; it++) {
        if (*it > target_value) {
            ;
        } else if (*it == target_value) {
            number_of_combinations++;
        } else {
            number_of_combinations += get_sub_number_of_combinations(it+1,end,target_value - *it, current_depth, target_depth);
        }
    }
    return number_of_combinations;

}

unsigned int get_number_of_combinations(std::vector<unsigned int> containers, unsigned int target_value) {
    return get_sub_number_of_combinations(containers.begin(),containers.end(), target_value,0,std::numeric_limits<int>::max());
}

unsigned int get_number_of_combinations_with_depth(std::vector<unsigned int> containers, unsigned int target_value, int target_depth) {
    return get_sub_number_of_combinations(containers.begin(),containers.end(), target_value,0,target_depth);
}

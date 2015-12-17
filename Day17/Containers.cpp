#include "Containers.hpp"

unsigned get_sub_number_of_combinations(std::vector<unsigned int>::const_iterator begin, const std::vector<unsigned int>::const_iterator end, unsigned int target_value) {
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
            number_of_combinations += get_sub_number_of_combinations(it+1,end,target_value - *it);
        }
    }
    return number_of_combinations;

}

unsigned int get_number_of_combinations(std::vector<unsigned int> containers, unsigned int target_value) {
    return get_sub_number_of_combinations(containers.begin(),containers.end(), target_value);
}

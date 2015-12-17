#ifndef CONTAINERS_HPP
#define CONTAINERS_HPP

#include <vector>

unsigned int get_number_of_combinations(std::vector<unsigned int> containers, unsigned int target_value);
unsigned int get_number_of_combinations_with_depth(std::vector<unsigned int> containers, unsigned int target_value, int depth);

#endif

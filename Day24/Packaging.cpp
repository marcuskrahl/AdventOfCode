#include "Packaging.hpp"

#include <cmath>
#include <array>
#include <limits>

const unsigned int package_groups = 3;


unsigned int get_target_weight(const std::vector<unsigned int>& packages) {
    unsigned int sum = 0;
    for(auto package:packages) {
        sum += package;
    }
    return sum/package_groups;
}

struct package_values {
    unsigned long quantum_entanglement;
    unsigned int packages_in_front;
    unsigned int weight;
};

void iterate (const std::vector<unsigned int>& packages, std::vector<unsigned int>::const_iterator start, package_values& best_values, package_values current_values, unsigned int target_weight) {
    for (auto it = start; it != packages.end(); it++) {
        package_values new_values = current_values;
        new_values.weight += *it;
        new_values.packages_in_front++;
        new_values.quantum_entanglement *= *it;
        if (new_values.weight < target_weight) {
            iterate(packages,it+1,best_values,new_values,target_weight);
        } else if (new_values.weight == target_weight)  {
            if ((new_values.packages_in_front < best_values.packages_in_front) 
                || (new_values.packages_in_front == best_values.packages_in_front && new_values.quantum_entanglement < best_values.quantum_entanglement)) {
                best_values = new_values;     
            }
        }
    }
    
}

unsigned int get_minimum_entaglement(const std::vector<unsigned int>& packages) {
    unsigned int target_weight = get_target_weight(packages);

    package_values best_values;
    best_values.packages_in_front = std::numeric_limits<unsigned int>::max();
    best_values.quantum_entanglement = std::numeric_limits<unsigned long>::max();
    best_values.weight = 0;

    package_values current_values;
    current_values.packages_in_front = 0;
    current_values.quantum_entanglement = 1;
    current_values.weight = 0;

    iterate(packages,packages.begin(),best_values,current_values,target_weight);
    
    return best_values.quantum_entanglement;
}

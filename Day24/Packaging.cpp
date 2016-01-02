#include "Packaging.hpp"

#include <cmath>
#include <array>

const unsigned int package_groups = 3;

bool is_equally_distributed(const std::vector<unsigned int>& packages, unsigned int distribution) {
    if (package_groups == 1) {
        return true;
    }
    std::array<unsigned int,package_groups> group_weight = {0};
    for (auto it =packages.rbegin(); it != packages.rend(); it++) {
        unsigned int group = distribution % package_groups;
        group_weight[group] += *it;
        distribution /= package_groups;
    }
    for (auto it1 = group_weight.begin(), it2 = group_weight.begin() + 1; it2 != group_weight.end(); it2++) {
        if (*it1 != *it2) {
            return false;
        }
    }
    return true;
}

unsigned int get_packages_in_front(const std::vector<unsigned int>& packages, unsigned int distribution) {
    unsigned int package_count = 0;
    for (auto it =packages.rbegin(); it != packages.rend(); it++) {
        if ((distribution % package_groups) == 0) {
            package_count++;
        }
        distribution /= package_groups;
    }
    return package_count;
}

unsigned int get_quantum_entanglement(const std::vector<unsigned int>& packages, unsigned int distribution) {
    unsigned int quantum_entanglement = 1;
    for (auto it =packages.rbegin(); it != packages.rend(); it++) {
        if ((distribution % package_groups) == 0) {
            quantum_entanglement *= *it;
        }
        distribution /= package_groups;
    }
    return quantum_entanglement;
}

unsigned int get_minimum_entaglement(const std::vector<unsigned int>& packages) {
    unsigned int distribution = 0;
    unsigned int best_packages_in_front = 1000;
    unsigned int best_quantum_entanglement = 1000;

    unsigned int max_distribution = pow(package_groups,packages.size());
    
    while(distribution < max_distribution) {
        if (is_equally_distributed(packages,distribution)) {
            unsigned int packages_in_front = get_packages_in_front(packages,distribution);
            unsigned int quantum_entanglement = get_quantum_entanglement(packages,distribution);
            if ((packages_in_front < best_packages_in_front) || (packages_in_front == best_packages_in_front && quantum_entanglement < best_quantum_entanglement)) {
                best_packages_in_front = packages_in_front;
                best_quantum_entanglement = quantum_entanglement;
            }
        }
       distribution++;
    }

    return best_quantum_entanglement;
}

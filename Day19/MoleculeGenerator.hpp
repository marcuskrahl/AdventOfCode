#ifndef MOLECULE_GENERATOR_HPP
#define MOLECULE_GENERATOR_HPP

#include "Replacement.hpp"

#include <vector>

class MoleculeGenerator {
    public:
        void add_replacement(Replacement replacement);
        unsigned int get_number_of_possible_results(const std::string& input_string) const;
        unsigned int get_shortest_steps_to_target_molecule(const std::string& input_string) const;
    private:
        std::vector<Replacement> replacements;
        std::vector<std::string> get_distinct_results(const std::string& input_string) const; 
        std::vector<std::string> get_all_possible_results(const std::string& input_string) const;
        std::vector<std::string> get_results_for_replacement(const Replacement& replacement, const std::string& input_string) const; 
};

#endif 


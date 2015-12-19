#include "MoleculeGenerator.hpp"
#include "Replacement.hpp"

#include <algorithm>
#include <random>
#include <chrono>

void MoleculeGenerator::add_replacement(Replacement replacement) {
    replacements.push_back(replacement);
}

unsigned int MoleculeGenerator::get_number_of_possible_results(const std::string& input_string) const {
    return get_distinct_results(input_string).size();
}

std::vector<std::string> MoleculeGenerator::get_distinct_results(const std::string& input_string) const {
    auto all_results = get_all_possible_results(input_string);
    std::sort(all_results.begin(), all_results.end());
    auto new_end = std::unique(all_results.begin(), all_results.end());
    all_results.resize(std::distance(all_results.begin(), new_end));
    return all_results;
}

std::vector<std::string> MoleculeGenerator::get_all_possible_results(const std::string& input_string) const {
    std::vector<std::string> all_results;
    for (const auto& replacement: replacements) {
        auto sub_results = get_results_for_replacement(replacement, input_string);
        all_results.insert(all_results.end(),sub_results.begin(),sub_results.end());
    }
    return all_results;
}

std::vector<std::string> MoleculeGenerator::get_results_for_replacement(const Replacement& replacement, const std::string& input_string) const {
    std::vector<std::string> results;
    auto replacement_input_length = replacement.get_input().length();
    size_t pos = 0;
    while ((pos = input_string.find(replacement.get_input(),pos)) != input_string.npos) {
        std::string new_string = input_string;
        new_string.replace(pos,replacement_input_length, replacement.get_output());
        results.push_back(new_string);
        pos++;
    }
    return results;
}

bool sort_replacements_descending(Replacement r1, Replacement r2) {
    return r1.get_output().length() > r2.get_output().length();
}

unsigned int MoleculeGenerator::get_shortest_steps_to_target_molecule(const std::string& input_string) const {
    unsigned int steps = 0;
    unsigned seed = std::chrono::system_clock::now().time_since_epoch().count();
    auto shuffled_replacements = replacements;
    std::shuffle(shuffled_replacements.begin(),shuffled_replacements.end(), std::default_random_engine(seed));
    std::string reduced_molecule =input_string;
    while (reduced_molecule != "e") {
        steps++;
        bool replaced = false;
        for (auto replacement: shuffled_replacements) {
            size_t reduce_position;
            if ((reduce_position = reduced_molecule.find(replacement.get_output())) != reduced_molecule.npos) {
                reduced_molecule.replace(reduce_position,replacement.get_output().length(),replacement.get_input());
                replaced = true;
                break;
            }
        }
        if (!replaced) {
            return get_shortest_steps_to_target_molecule(input_string);
        }
    }
    return steps;
}

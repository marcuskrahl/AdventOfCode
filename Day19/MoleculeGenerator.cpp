#include "MoleculeGenerator.hpp"
#include "Replacement.hpp"

#include <algorithm>

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




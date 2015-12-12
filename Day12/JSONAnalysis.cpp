#include "JSONAnalysis.hpp"

#include <regex>

std::regex number_regex("-?\\d+");

int get_sum_of_numbers(const std::string& input) {
    std::smatch match;
    int sum = 0;
    std::string reduced_input = input;
    while (std::regex_search(reduced_input, match, number_regex)) {
        int extracted_number = std::stoi(match[0]);
        sum += extracted_number;
        reduced_input = match.suffix().str();
    }
    return sum;
}

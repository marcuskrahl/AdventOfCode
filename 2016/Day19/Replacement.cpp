#include "Replacement.hpp"

#include <regex>

std::regex replacement_regex("(\\w+) => (\\w+)");

Replacement::Replacement(const std::string& input_string) {
    std::smatch match;
    if (!std::regex_match(input_string,match,replacement_regex)) {
        throw "invalid replacement syntax";
    }
    input = match[1];
    output = match[2];
}

std::string Replacement::get_input() const {
    return input;
}

std::string Replacement::get_output() const {
    return output;
}

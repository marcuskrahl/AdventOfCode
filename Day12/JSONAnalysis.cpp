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

std::string::iterator get_position_of_open_brace(std::string& input, size_t pos) {
    auto it = input.begin() + pos;
    int level = 0;
    do {
        it--;
        if (*it == '}') {
            level++;
        } else if (*it == '{') {
            if (level == 0) {
                break;
            } else {
                level--;
            }
        }
    } while (it != input.begin());
    return it;
}

std::string::iterator get_position_of_close_brace(std::string& input, size_t pos) {
    auto it = input.begin() + pos;
    int level = 0;
    while (it != input.end()) {
        if (*it == '{') {
            level++;
        } else if (*it == '}') {
            if (level == 0) {
                break;
            } else {
                level--;
            }
        }
        it++;
    } 
    return it;
}

std::string remove_red_objects(std::string input) {
    size_t pos;
    while ((pos = input.find(":\"red\"")) != std::string::npos) {
        auto pos_open = get_position_of_open_brace(input, pos);
        auto pos_close = get_position_of_close_brace(input, pos);
        input.erase(pos_open,pos_close+1);
    }
    return input;
}

int get_sum_of_numbers_without_red(const std::string& input) {
    std::string input_without_red = remove_red_objects(input);
    return get_sum_of_numbers(input_without_red);
}


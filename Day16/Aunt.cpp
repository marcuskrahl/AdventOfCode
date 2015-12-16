#include "Aunt.hpp"

#include <regex>

std::regex aunt_regex("(\\w+): (\\d+)");

Aunt::Aunt(const std::string& input) {
    std::smatch match;
    std::string tmp = input;
    while (std::regex_search(tmp, match, aunt_regex)) {
        values.insert(std::pair<std::string,int>(match[1],std::stoi(match[2]))); 
        tmp = match.suffix().str();
    }
}


int Aunt::get_value(const std::string& key) const {
    auto index = values.find(key);
    if (index != values.end()) {
        return index->second;
    } else {
        return -1;
    }
}

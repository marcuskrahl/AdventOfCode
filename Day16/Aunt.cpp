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

bool operator==(const Aunt& aunt1, const Aunt& aunt2) {
    return Aunt::all_properties_of_first_aunt_in_second_aunt(aunt1,aunt2) && Aunt::all_properties_of_first_aunt_in_second_aunt(aunt2,aunt1);
}

bool Aunt::all_properties_of_first_aunt_in_second_aunt(const Aunt& aunt1, const Aunt& aunt2) {
    for(auto it=aunt1.values.begin(); it != aunt1.values.end(); it++) {
        int other_value = aunt2.get_value(it->first);
        if ((other_value != -1) && (other_value != it->second)) {
            return false;
        }
    }
    return true;
}

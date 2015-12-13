#include "Seating.hpp"

#include <regex>

Seating::Seating(std::string first_person, std::string second_person, int value) : 
    first_person(first_person), second_person(second_person), value(value) {

}

std::string Seating::get_first_person() const {
    return first_person;
}

std::string Seating::get_second_person() const {
    return second_person;
}

int Seating::get_value() const {
    return value;
}

std::regex seating_format("(\\w+) would (gain|lose) (\\d+) happiness units by sitting next to (\\w+).");

Seating Seating::from_string(const std::string& input) {
    std::smatch match;
    if (! std::regex_match(input,match,seating_format)) {
        throw "invalid seating format";
    }
    int value = std::stoi(match[3]);
    if (match[2] == "lose") {
        value = -value;
    }
    return Seating(match[1],match[4],value);
}

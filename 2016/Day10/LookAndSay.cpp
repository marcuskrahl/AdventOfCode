#include "LookAndSay.hpp"

#include <sstream>

std::string look_and_say(const std::string& input) {
    if (input == "") {
        return "";
    }
    std::stringstream output;
    char current_char = *input.begin();
    unsigned int number_of_occurences = 1;
    auto it = input.begin()+1;
    while (it != input.end()) {
       if (*it != current_char) {
           output << number_of_occurences << current_char;
           number_of_occurences = 1;
           current_char = *it;
       } else {
            number_of_occurences++;
       }
       it++;
    }
    output << number_of_occurences << current_char;
    return output.str();
}

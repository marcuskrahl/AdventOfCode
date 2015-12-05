#include "naughty_or_nice.hpp"

bool is_vowel(const char& c) {
    switch(c) {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        return true;
    default:
        return false;
    }
}

bool has_at_least_three_vowels(const std::string& input) {
    unsigned int number_of_vowels = 0;
    for(const auto& c: input) {
        if (is_vowel(c)) {
            number_of_vowels++;
        }
    }
    return number_of_vowels >= 3;
}

bool has_at_least_one_double_letter(const std::string& input) {
    for (auto it = input.begin()+1; it != input.end(); it++) {
        if( *(it-1) == *it) {
            return true;
        }
    }
    return false;
}

bool is_nice(const std::string& input) {
    return has_at_least_three_vowels(input) && has_at_least_one_double_letter(input);
}

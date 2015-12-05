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

bool is_forbidden_sequence(const char& c1, const char& c2) {
    if ((c1 == 'a') && (c2 == 'b')) {
        return true;
    }
    if ((c1 == 'c') && (c2 == 'd')) {
        return true;
    }
    if ((c1 == 'p') && (c2 == 'q')) {
        return true;
    }
    if ((c1 == 'x') && (c2 == 'y')) {
        return true;
    }
    return false;
}

bool has_no_restricted_sequence(const std::string& input) {
    for (auto it = input.begin()+1; it != input.end(); it++) {
        if (is_forbidden_sequence(*(it-1), *it)) {
            return false;
        }
    }
    return true;
}

bool is_nice(const std::string& input) {
    return has_at_least_three_vowels(input) && has_at_least_one_double_letter(input) && has_no_restricted_sequence(input);
}

bool is_repeating_char_double(const char& c1, const char& c2, const std::string& input, std::string::const_iterator it) {
    if (it == input.end()) {
        return false;
    }
    for (it++; it != input.end(); it++) {
        if ((*(it-1) == c1) && (*it == c2)) {
            return true;
        }
    }
    return false;
}

bool has_repeating_char_double(const std::string& input) {
    if (input == "") {
        return false;     
    }
    for (auto it = input.begin()+1; it != input.end(); it++) {
        if (is_repeating_char_double(*(it-1), *it, input, it+1)) {
            return true;
        }
    }
    return false;
}

bool has_repeating_char_with_gap(const std::string& input) {
    if (input.length() < 3) {
        return false;
    }
    for (auto it1 = input.begin(), it2 = input.begin() + 2; it1 != input.end(), it2 != input.end(); it1++,it2++) {
        if(*it1 == *it2) {
            return true;
        }
    }
    return false;
}

bool is_nice2(const std::string& input) {
    return has_repeating_char_double(input);
}

#include "PasswordGeneration.hpp"

void increment_char(char& char_to_increment) {
    if (char_to_increment == 'z') {
        char_to_increment = 'a';
    } else {
        char_to_increment++;
    }
}
std::string increment_password(const std::string& old_password) {
    std::string new_password(old_password);
    auto it = new_password.end();
    do {
        it--;
        increment_char(*it);
        if (*it != 'a') {
            break;
        }
    } while (it != new_password.begin());
    return new_password;
}

bool has_straight(const std::string& password) {
    if (password.length() < 3) {
        return false;
    }
    auto first_char = password.begin();
    auto second_char = password.begin()+1;
    auto third_char = password.begin()+2;
    while (third_char != password.end()) {
        if (((*second_char) - (*first_char) == 1) && ((*third_char) - (*second_char) == 1)) {
            return true;
        }
        first_char++;
        second_char++;
        third_char++;
    }
    return false;
}

bool does_not_contain_i_o_l(const std::string& password) {
    for(auto c: password) {
        if ((c == 'i') || (c == 'o') || (c == 'l')) {
            return false;
        }
    }
    return true;
}

std::string::const_iterator find_pair(std::string::const_iterator iter, const std::string::const_iterator end) {
    if (iter == end) {
        return end;
    }
    auto first_char = iter;
    auto second_char = iter+1;
    while (second_char != end) {
        if (*first_char == *second_char) {
            return first_char;
        }
        first_char++; second_char++;
    }
    return end;
}

bool has_two_different_pairs(const std::string& password) {
    auto first_pair = find_pair(password.begin(), password.end());
    if (first_pair == password.end()) {
        return false;
    }
    auto second_pair = first_pair;
    do {
        second_pair = find_pair(second_pair+2, password.end());
        if (second_pair == password.end()) {
            return false;
        }
    } while (*second_pair == *first_pair);
    return true;
}

bool is_valid_password(const std::string& password) {
    return has_straight(password) && does_not_contain_i_o_l(password) && has_two_different_pairs(password);
}

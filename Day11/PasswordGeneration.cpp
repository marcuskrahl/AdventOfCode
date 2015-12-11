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

bool is_valid_password(const std::string& password) {
    return has_straight(password);
}

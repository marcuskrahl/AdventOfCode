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

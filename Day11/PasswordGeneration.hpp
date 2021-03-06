#ifndef PASSWORD_GENERATION_HPP
#define PASSWORD_GENERATION_HPP

#include <string>

std::string increment_password(const std::string& old_password);
bool is_valid_password(const std::string& password);

#endif

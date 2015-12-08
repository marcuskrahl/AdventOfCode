#include "Santa_StringLength.hpp"

size_t string_length(const std::string& input) {
    return input.length();
}

size_t memory_length(const std::string& input) {
    return input.length()-2;
}

#include "Santa_StringLength.hpp"

size_t string_length(const std::string& input) {
    return input.length();
}

size_t memory_length(const std::string& input) {
    size_t length = 0;
    size_t surrounding_quotes = 2;
    for ( auto it = input.begin(); it != input.end(); it++) {
       if ((*it == '\\') && ((it+1) != input.end()) && (*(it+1) == '\\')) {
           length += 1;
           it++;
       } else {
            length += 1;
       }
    }
    return length-surrounding_quotes;
}

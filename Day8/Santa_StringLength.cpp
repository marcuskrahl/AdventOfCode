#include "Santa_StringLength.hpp"

size_t string_length(const std::string& input) {
    return input.length();
}

bool is_escaped_char(const char& char_to_escape, std::string::const_iterator& position, const std::string::const_iterator& end) {
    if (*position != '\\') {
        return false;
    }
    auto next_char_position = position+1;
    if (next_char_position == end) {
        return false;
    }
    if (*next_char_position != char_to_escape) {
        return false;
    }
    return true;
}

size_t memory_length(const std::string& input) {
    size_t length = 0;
    size_t surrounding_quotes = 2;
    for ( auto it = input.begin(); it != input.end(); it++) {
       if (is_escaped_char('\\',it,input.end()) || is_escaped_char('\"',it,input.end())) {
           length += 1;
           it++;
       } else {
            length += 1;
       }
    }
    return length-surrounding_quotes;
}


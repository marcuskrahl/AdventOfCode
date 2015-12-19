#ifndef REPLACEMENT_HPP
#define REPLACEMENT_HPP

#include <string>

class Replacement {
    public:
        Replacement(const std::string& input_string);
        std::string get_input() const;
        std::string get_output() const;
    private:
        std::string input;
        std::string output;
};

#endif

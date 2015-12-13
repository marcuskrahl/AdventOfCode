#ifndef SEATING_HPP
#define SEATING_HPP

#include <string>

class Seating {
    public:
        Seating(std::string first_person, std::string second_person, int value);
        std::string get_first_person() const;
        std::string get_second_person() const;
        int get_value() const;

        static Seating from_string(const std::string& input);
    private:
        std::string first_person;
        std::string second_person;
        int value;
};
#endif

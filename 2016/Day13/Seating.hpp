#ifndef SEATING_HPP
#define SEATING_HPP

#include <string>
#include <vector>

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

class SeatingPlan {
    public:
        void add_rule(Seating seating_rule);
        int get_maximum_happiness() const;
    private:
        std::vector<Seating> seating_rules;
        std::vector<std::string> get_persons() const; 
        int get_happiness(const std::vector<std::string> persons) const;
        int get_happiness_value_for_rule(const std::string& first_person, const std::string& second_person) const;
};
#endif

#include "Seating.hpp"

#include <regex>
#include <algorithm>
#include <limits>

Seating::Seating(std::string first_person, std::string second_person, int value) : 
    first_person(first_person), second_person(second_person), value(value) {

}

std::string Seating::get_first_person() const {
    return first_person;
}

std::string Seating::get_second_person() const {
    return second_person;
}

int Seating::get_value() const {
    return value;
}

std::regex seating_format("(\\w+) would (gain|lose) (\\d+) happiness units by sitting next to (\\w+).");

Seating Seating::from_string(const std::string& input) {
    std::smatch match;
    if (! std::regex_match(input,match,seating_format)) {
        throw "invalid seating format";
    }
    int value = std::stoi(match[3]);
    if (match[2] == "lose") {
        value = -value;
    }
    return Seating(match[1],match[4],value);
}

void SeatingPlan::add_rule(Seating seating_rule) {
    seating_rules.push_back(seating_rule);
}

int SeatingPlan::get_maximum_happiness() const {
    auto persons = get_persons();
    std::sort(persons.begin(), persons.end());
    int max_happiness = std::numeric_limits<int>::min() ;
    do {
        int happiness = get_happiness(persons);
        if (happiness > max_happiness) {
            max_happiness = happiness;
        }
    } while (std::next_permutation(persons.begin(), persons.end()));
    return max_happiness;
}

bool is_person_in_vector(const std::string& person, const std::vector<std::string>& persons) {
    for(auto p: persons) {
        if (p==person) {
            return true;
        }
    }
    return false;
}

std::vector<std::string> SeatingPlan::get_persons() const {
    std::vector<std::string> persons;
    for(const auto rule: seating_rules) {
        if (!(is_person_in_vector(rule.get_first_person(),persons))) {
            persons.push_back(rule.get_first_person());
        }
        if (!(is_person_in_vector(rule.get_second_person(),persons))) {
            persons.push_back(rule.get_second_person());
        }
    }
    return persons;
}

int SeatingPlan::get_happiness(const std::vector<std::string> persons) const {
   if (persons.size() < 2) {
        throw "not enouqh persons";
   }
   auto first_person = persons.begin();
   auto second_person = persons.begin()+1;
   int total_happiness = 0;
   while (second_person != persons.end()) {
       total_happiness += get_happiness_value_for_rule(*first_person,*second_person);
       total_happiness += get_happiness_value_for_rule(*second_person,*first_person);
       first_person++;
       second_person++;
   }
   total_happiness += get_happiness_value_for_rule(persons.front(),persons.back()); 
   total_happiness += get_happiness_value_for_rule(persons.back(),persons.front()); 
   return total_happiness;
}

int SeatingPlan::get_happiness_value_for_rule(const std::string& first_person, const std::string& second_person) const {
    for (auto rule: seating_rules) {
        if ((rule.get_first_person() == first_person) && (rule.get_second_person() == second_person)) {
            return rule.get_value();
        }
    }
    throw "corresponding rule not found";
}

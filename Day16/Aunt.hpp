#ifndef AUNT_HPP
#define AUNT_HPP

#include <string>
#include <map>

class Aunt {
    public:
        Aunt(const std::string& input);
        int get_value(const std::string& key) const;
        bool range_equals(const Aunt& reference_aunt) const;
    private:
        std::map<std::string,int> values;
        static bool all_properties_of_first_aunt_in_second_aunt(const Aunt& aunt1, const Aunt& aunt2);
    
    friend bool operator==(const Aunt& aunt1, const Aunt& aunt2);
};

bool operator==(const Aunt& aunt1, const Aunt& aunt2);

#endif

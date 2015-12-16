#ifndef AUNT_HPP
#define AUNT_HPP

#include <string>
#include <map>

class Aunt {
    public:
        Aunt(const std::string& input);
        int get_value(const std::string& key) const;
    private:
        std::map<std::string,int> values;

};

#endif

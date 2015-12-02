#ifndef WRAPPING_PAPER_FUNCTIONS_HPP
#define WRAPPING_PAPER_FUNCTIONS_HPP

#include <string>

class Present {
    public:
        Present(const std::string& dimensions);
        unsigned int get_length();
        unsigned int get_width();
        unsigned int get_height();
    private:
        unsigned int length;
        unsigned int width;
        unsigned int height; 

};

#endif

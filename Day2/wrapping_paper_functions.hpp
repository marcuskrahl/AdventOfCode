#ifndef WRAPPING_PAPER_FUNCTIONS_HPP
#define WRAPPING_PAPER_FUNCTIONS_HPP

#include <string>

class Present {
    public:
        Present(const std::string& dimensions);
        unsigned int get_length() const;
        unsigned int get_width() const;
        unsigned int get_height() const;
    private:
        unsigned int length;
        unsigned int width;
        unsigned int height; 

};

unsigned int calculate_wrapping_paper_area(const Present& present);

#endif

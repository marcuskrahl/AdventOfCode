#include "wrapping_paper_functions.hpp"

#include <sstream>

#define VALUE_DELIMITER 'x'

unsigned int get_dimension_value(std::stringstream& dimensions_stream); 

Present::Present(const std::string& dimensions) {
    std::stringstream dimensions_stream(dimensions);

    length = get_dimension_value(dimensions_stream);
    width = get_dimension_value(dimensions_stream);
    height = get_dimension_value(dimensions_stream);
}

unsigned int get_dimension_value(std::stringstream& dimensions_stream) {
    std::string dimension_value;
    std::getline(dimensions_stream,dimension_value,VALUE_DELIMITER);
    return std::stoi(dimension_value);
}

unsigned int Present::get_length() {
    return length;
}

unsigned int Present::get_width() {
    return width;
}

unsigned int Present::get_height() {
    return height;
}

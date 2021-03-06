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

unsigned int Present::get_length() const {
    return length;
}

unsigned int Present::get_width() const {
    return width;
}

unsigned int Present::get_height() const {
    return height;
}

unsigned int get_smallest_area(unsigned int area1, unsigned int area2, unsigned int area3) {
    if (area1 < area2) {
        if (area1 < area3) {
            return area1;
        } else {
            return area3;
        }
    } else {
        if (area2 < area3) {
            return area2;
        } else {
            return area3;
        }
    }

}
unsigned int calculate_wrapping_paper_area(const Present& present) {
    unsigned int front = present.get_length() * present.get_height();
    unsigned int top = present.get_length() * present.get_width();
    unsigned int side = present.get_width() * present.get_height();

    unsigned smallest_area = get_smallest_area(front,top,side);

    return 2*front + 2*top + 2*side + smallest_area;
}

unsigned int calculate_length_of_two_shortest_sides(const Present& present) {
    auto length = present.get_length();
    auto width = present.get_width();
    auto height = present.get_height();

    if (length > width) {
        if (length > height) {
            return width + height;
        } else {
            return length + width;
        }
    } else {
        if (width > height) {
            return length + height;
        } else {
            return length + width;
        }
    }
}

unsigned int calculate_volume(const Present& present) {
    return present.get_length() * present.get_width() * present.get_height();
}

unsigned int calculate_ribbon_length(const Present& present) {
    unsigned int length_of_two_shortest_sides = calculate_length_of_two_shortest_sides(present);
    unsigned int volume = calculate_volume(present);

    return 2*length_of_two_shortest_sides + volume;
}

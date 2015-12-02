#define CATCH_CONFIG_MAIN
#include "catch.hpp"

#include "wrapping_paper_functions.hpp"


TEST_CASE("Present dimensions are correctly parsed","[area_calculation]") {
    
    Present present("3x4x5");

    REQUIRE(present.get_length() == 3);
    REQUIRE(present.get_width() == 4);
    REQUIRE(present.get_height() == 5);
}

TEST_CASE("Wrapping paper area is correctly calculated","[area_calculation]") {
    Present present1("2x3x4");
    Present present2("1x1x10");

    REQUIRE(calculate_wrapping_paper_area(present1) == 58);
    REQUIRE(calculate_wrapping_paper_area(present2) == 43);
    REQUIRE(calculate_wrapping_paper_area(Present("20x3x11")) == 659);
}

TEST_CASE("Ribbon length is correctly calculated","[ribbon_length]") {
    REQUIRE(calculate_ribbon_length(Present("2x3x4")) == 34);
    REQUIRE(calculate_ribbon_length(Present("1x1x10")) == 14);
    REQUIRE(calculate_ribbon_length(Present("20x3x11")) == 688);
}

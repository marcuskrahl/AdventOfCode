#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "PresentDistribution.hpp"

TEST_CASE("correct number of presents are calculated for each house","[present distribution]") {
    
    REQUIRE(presents_in_house(1) == 10);
    REQUIRE(presents_in_house(2) == 30);
    REQUIRE(presents_in_house(6) == 120);
    REQUIRE(presents_in_house(8) == 150);
}

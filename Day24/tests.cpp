#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Packaging.hpp"

TEST_CASE("minimum quantum entaglement is returned","[packaging]") {
    std::vector<unsigned int> packages = {1,2,3,4,5,7,8,9,10,11};

    REQUIRE( get_minimum_entaglement(packages) == 99);
}

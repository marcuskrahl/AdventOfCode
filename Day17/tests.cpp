#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Containers.hpp"

TEST_CASE("All combinations of containers are found","[containers]") {
   
    std::vector<unsigned int> containers = {20,15,10,5,5};

    REQUIRE(get_number_of_combinations(containers,25) == 4);

}

TEST_CASE("All combinations with a given depth are found","[containers]") {
    std::vector<unsigned int> containers = {20,15,10,5,5};
    REQUIRE(get_number_of_combinations_with_depth(containers,25,2) == 3);
}

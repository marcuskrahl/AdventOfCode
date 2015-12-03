#define CATCH_CONFIG_MAIN
#include "catch.hpp"

#include "SantaMap.hpp"

TEST_CASE("Santa movement is correctly calculated for easy test case","[santa movement]") {
    SantaMap map;
    
    map.move('>');
    REQUIRE(map.get_visited_houses() == 2);
}

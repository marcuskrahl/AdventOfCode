#define CATCH_CONFIG_MAIN
#include "catch.hpp"

#include "SantaMap.hpp"

TEST_CASE("Santa movement is correctly calculated for easy test case","[santa movement]") {
    SantaMap map;
    
    map.move('>');
    REQUIRE(map.get_visited_houses() == 2);
}

TEST_CASE("Santa movement is correctly calculated for extended test case","[santa movement]") {
    SantaMap map;
    
    map.move('^');
    map.move('>');
    map.move('v');
    map.move('<');
    REQUIRE(map.get_visited_houses() == 4);
}

TEST_CASE("Santa movement is correctly calculated for back and forth movement","[santa movement]") {
    SantaMap map;
    
    map.move('^');
    map.move('v');
    map.move('^');
    map.move('v');
    map.move('^');
    map.move('v');
    map.move('^');
    map.move('v');
    map.move('^');
    map.move('v');
    REQUIRE(map.get_visited_houses() == 2);
}





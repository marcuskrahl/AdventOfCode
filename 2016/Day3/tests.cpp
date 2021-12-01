#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

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

TEST_CASE("Movements of distinct Santas are correctly combined", "[santa movement]") {
    SantaMap map1;

    map1.move('<');
    map1.move('^');

    SantaMap map2;
    
    map2.move('<');
    map2.move('v');

    SantaMap combined_map(map1, map2);

    REQUIRE(combined_map.get_visited_houses() == 4);
}




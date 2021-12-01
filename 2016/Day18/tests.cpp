#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "LightMap.hpp"

TEST_CASE("Light map can be used to store the state of lights","[light map]") {
    LightMap map(6,6);

    REQUIRE(map.get_active_lights() == 0);

    map.turn_on(3,3);
    map.turn_on(3,5);
    map.turn_on(3,3);

    REQUIRE(map.get_active_lights() == 2);
    REQUIRE(map.is_on(3,3) == true);
    REQUIRE(map.is_on(3,5) == true);
    REQUIRE(map.is_on(3,4) == false);

    map.turn_off(3,5);

    REQUIRE(map.get_active_lights() == 1);
    REQUIRE(map.is_on(3,3) == true);
    REQUIRE(map.is_on(3,5) == false);

}


TEST_CASE("If there are exactly 3 light neighbors, a light is turned on","[light map]") {
    LightMap map1(2,2);
    map1.turn_on(0,0);
    map1.turn_on(0,1);
    map1.turn_on(1,0);

    auto result = map1.evolve();

    REQUIRE(result.is_on(1,1) == true);

    LightMap map2(2,2);
    map2.turn_on(0,0);
    map2.turn_on(0,1);

    auto result2 = map2.evolve();

    REQUIRE(result2.is_on(1,1) == false);

    LightMap map3(2,3);
    map3.turn_on(0,0);
    map3.turn_on(0,1);
    map3.turn_on(0,2);
    map3.turn_on(1,0);

    auto result3 = map3.evolve();

    REQUIRE(result3.is_on(1,1) == false);
}

TEST_CASE("If there are 2 or 3 light neighbors, a switched on light remains on","[light map]") {
    LightMap map1(2,2);
    map1.turn_on(0,0);
    map1.turn_on(0,1);
    map1.turn_on(1,0);

    auto result = map1.evolve();

    REQUIRE(result.is_on(0,0) == true);

    LightMap map2(2,2);
    map2.turn_on(0,0);
    map2.turn_on(0,1);
    map2.turn_on(1,0);
    map2.turn_on(1,1);

    auto result2 = map2.evolve();

    REQUIRE(result2.is_on(0,0) == true);

    LightMap map3(2,3);
    map3.turn_on(0,0);
    map3.turn_on(0,1);
    map3.turn_on(0,2);
    map3.turn_on(1,0);
    map3.turn_on(1,1);

    auto result3 = map3.evolve();

    REQUIRE(result3.is_on(1,1) == false);

    LightMap map4(2,2);
    map4.turn_on(0,0);
    map4.turn_on(0,1);

    auto result4 = map4.evolve();

    REQUIRE(result4.is_on(0,0) == false);
}

TEST_CASE("Lights on edges remain on with corner_evolve","[light map]") {
    LightMap map(3,3);

    auto result = map.corner_evolve();

    REQUIRE (result.is_on(0,0) == true);
    REQUIRE (result.is_on(2,0) == true);
    REQUIRE (result.is_on(2,2) == true);
    REQUIRE (result.is_on(0,2) == true);
}

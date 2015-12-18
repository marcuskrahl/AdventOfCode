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

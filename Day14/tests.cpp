#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Reindeer.hpp"

TEST_CASE("distance of reindeer is correctly calculated","[reindeer distance]") {
    REQUIRE(Reindeer(14,10,127).get_distance_after_seconds(1000) == 1120);
    REQUIRE(Reindeer(16,11,162).get_distance_after_seconds(1000) == 1056);
    REQUIRE(Reindeer(14,10,127).get_distance_after_seconds(140) == 182);
    REQUIRE(Reindeer(16,11,162).get_distance_after_seconds(140) == 176);
}

TEST_CASE("reindeers can be initialized with strings","[reindeer distance]") {
    REQUIRE(Reindeer::from_string("Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.").get_distance_after_seconds(1000) == 1120);
}

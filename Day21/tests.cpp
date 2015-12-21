#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "BossFight.hpp"

TEST_CASE("Boss fights are correctly simulated","[boss fight]") {
    REQUIRE(boss_fight(8,5,5,12,7,2) == true);
    REQUIRE(boss_fight(8,5,5,12,8,2) == false);
}

#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Ingredient.hpp"

TEST_CASE("ingredients are parsed correcty","[ingredients]") {
    Ingredient ingredient("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8");

    REQUIRE(ingredient.get_capacity() == -1);
    REQUIRE(ingredient.get_durability() == -2);
    REQUIRE(ingredient.get_flavor() == 6);
    REQUIRE(ingredient.get_texture() == 3);
    REQUIRE(ingredient.get_calories() == 8);

}

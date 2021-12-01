#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Ingredient.hpp"

#include <vector>

TEST_CASE("ingredients are parsed correcty","[ingredients]") {
    Ingredient ingredient("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8");

    REQUIRE(ingredient.get_capacity() == -1);
    REQUIRE(ingredient.get_durability() == -2);
    REQUIRE(ingredient.get_flavor() == 6);
    REQUIRE(ingredient.get_texture() == 3);
    REQUIRE(ingredient.get_calories() == 8);

}

TEST_CASE("optimal ingredient composition is correctly found","[ingredients]") {
    std::vector<Ingredient> ingredients;
    ingredients.push_back(Ingredient("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8"));
    ingredients.push_back(Ingredient("Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3"));

    REQUIRE(get_optimal_composition(ingredients) == 62842880);
}

TEST_CASE("optimal ingredient is correctly found for fixed calories","[ingredients]") {
    std::vector<Ingredient> ingredients;
    ingredients.push_back(Ingredient("Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8"));
    ingredients.push_back(Ingredient("Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3"));

    REQUIRE(get_optimal_composition(ingredients,500) == 57600000);
}

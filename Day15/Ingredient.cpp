#include "Ingredient.hpp"

#include <regex>

std::regex ingredient_regex("\\w+: capacity (-?\\d+), durability (-?\\d+), flavor (-?\\d+), texture (-?\\d+), calories (-?\\d+)");

Ingredient::Ingredient(const std::string& input) {
    std::smatch match;
    if (!std::regex_match(input,match,ingredient_regex)) {
        throw "invalid ingedient format";
    }
    capacity = std::stoi(match[1]);
    durability = std::stoi(match[2]);
    flavor = std::stoi(match[3]);
    texture = std::stoi(match[4]);
    calories = std::stoi(match[5]);
}

int Ingredient::get_capacity() const {
    return capacity;
}

int Ingredient::get_durability() const {
    return durability;
}

int Ingredient::get_flavor() const {
    return flavor;
}

int Ingredient::get_texture() const {
    return texture;
}

int Ingredient::get_calories() const {
    return calories;
}

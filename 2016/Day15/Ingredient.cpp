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

long get_composition_value(const std::vector<Ingredient>& ingredients, const std::vector<int>& parts) {
    long total_capacity = 0;
    for (size_t i = 0; i<ingredients.size(); i++) {
        total_capacity += ingredients[i].get_capacity() * parts[i];
    }
    long total_durability = 0;
    for (size_t i = 0; i<ingredients.size(); i++) {
        total_durability += ingredients[i].get_durability() * parts[i];
    }
    long total_flavor = 0;
    for (size_t i = 0; i<ingredients.size(); i++) {
        total_flavor += ingredients[i].get_flavor() * parts[i];
    }
    long total_texture = 0;
    for (size_t i = 0; i<ingredients.size(); i++) {
        total_texture += ingredients[i].get_texture() * parts[i];
    }
    if ((total_capacity <= 0) || (total_durability <= 0) || (total_flavor <= 0) || (total_texture <= 0)) {
        return 0;
    }
    return total_capacity * total_durability * total_flavor * total_texture;
}

bool next_composition(std::vector<int>& composition) {
    if (composition.front() == 100) {
        return false;
    }
    auto iter = composition.begin()+1;
    while(*iter == 0) {
        iter++;
    }
    int taken_values_up_to_iter = 100;
    auto iter2 = composition.end()-1;
    while (iter2 != iter) {
        taken_values_up_to_iter -= *iter2;
        iter2--;
    }
    (*iter)--;
    *(iter-1) = taken_values_up_to_iter - *iter;
    iter--;
    if (iter == composition.begin()) {
        return true;
    }
    do {
        iter--;
        *iter = 0;
    } while (iter != composition.begin()); 
    return true;

}

unsigned int get_calorie_count(const std::vector<Ingredient>& ingredients, const std::vector<int>& composition) {
    unsigned int calorie_count = 0;
    for(size_t i = 0; i < ingredients.size(); i++) {
        calorie_count += ingredients[i].get_calories() * composition[i];
    }
    return calorie_count;
}

long get_optimal_composition(std::vector<Ingredient> ingredients, unsigned int target_calorie_count, bool use_calorie_count) {
    long max_composition_value = 0;
    std::vector<int> composition(ingredients.size(),0);
    composition.back() = 100;
    do {
        long composition_value = get_composition_value(ingredients, composition);
        if ((composition_value > max_composition_value) && (!use_calorie_count || target_calorie_count == get_calorie_count(ingredients, composition))) {

            max_composition_value = composition_value;
        }
    } while (next_composition(composition));
    return max_composition_value;
}

long get_optimal_composition(std::vector<Ingredient> ingredients) {
    return get_optimal_composition(ingredients, -1, false);
}

long get_optimal_composition(std::vector<Ingredient> ingredients, unsigned int target_calorie_count) {
    return get_optimal_composition(ingredients,target_calorie_count,true);
}


#ifndef INGREDIENT_HPP
#define INGREDIENT_HPP

#include <string>
#include <vector>

class Ingredient {
    public:
        Ingredient(const std::string& input);
        int get_capacity() const;
        int get_durability() const;
        int get_texture() const;
        int get_flavor() const;
        int get_calories() const;
    private:
        int capacity;
        int durability;
        int texture;
        int flavor;
        int calories;
};

long get_optimal_composition(std::vector<Ingredient> ingredients);

#endif

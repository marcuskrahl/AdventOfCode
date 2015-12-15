#include <iostream>
#include <string>
#include <vector>

#include "Ingredient.hpp"

void run_part_one() {
    std::string line;
    std::vector<Ingredient> ingredients;
    while (std::getline(std::cin, line)) {
        ingredients.push_back(Ingredient(line));
    }
    std::cout << get_optimal_composition(ingredients) << std::endl;
}
void run_part_two() {
}


int main(int argc, char* argv[]) {
    if (argc > 1) {
        if (std::string(argv[1]) == "--part_two") {
            run_part_two();
        } else {
            std::cout << "Usage: day15 [--part_two]" << std::endl;
            return -1;
        }
    } else {
        run_part_one();
    }
}

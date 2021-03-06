#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Replacement.hpp"
#include "MoleculeGenerator.hpp"

TEST_CASE("replacements_are_correctly_read_by_input","[molecule replacement]") {
    
    Replacement replacement("H => OH");

    REQUIRE (replacement.get_input() == "H");
    REQUIRE (replacement.get_output() == "OH");
}

TEST_CASE("molecule generator performs all possible replacements","[molecule replacement]") {
    
    MoleculeGenerator generator;

    Replacement replacement("H => OH");
    generator.add_replacement(replacement);

    REQUIRE(generator.get_number_of_possible_results("HAHAH") == 3);
}

TEST_CASE("molecule generator only counts distinct solutions","[molecule replacement]") {
    
    MoleculeGenerator generator;

    Replacement replacement("H => OH");
    Replacement replacement2("HA => OHA");
    generator.add_replacement(replacement);
    generator.add_replacement(replacement2);

    REQUIRE(generator.get_number_of_possible_results("HAHAH") == 3);
}

TEST_CASE("molecule generator finds shortest amount of steps to target molecule","[molecule replacement]") {
    MoleculeGenerator generator;
    generator.add_replacement(Replacement("e => H"));
    generator.add_replacement(Replacement("e => O"));
    generator.add_replacement(Replacement("H => HO"));
    generator.add_replacement(Replacement("H => OH"));
    generator.add_replacement(Replacement("O => HH"));

    REQUIRE(generator.get_shortest_steps_to_target_molecule("HOHOHO") == 6);
}

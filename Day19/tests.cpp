#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Replacement.hpp"

TEST_CASE("replacements_are_correctly_read_by_input","[molecule replacement]") {
    
    Replacement replacement("H => OH");

    REQUIRE (replacement.get_input() == "H");
    REQUIRE (replacement.get_output() == "OH");
}

#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "naughty_or_nice.hpp"

TEST_CASE("Word is nice if it has at least three vowels","[naughty or nice]") {
    REQUIRE(is_nice("") == false);
    REQUIRE(is_nice("ae") == false);
    REQUIRE(is_nice("aee") == true); 
}

TEST_CASE("Word is nice if it has at least one double letter","[naughty or nice]") {
    REQUIRE(is_nice("aeu") == false);
    REQUIRE(is_nice("aeuu") == true);
    REQUIRE(is_nice("addeu") == true);
}

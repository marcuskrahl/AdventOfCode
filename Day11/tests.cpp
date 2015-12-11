#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "PasswordGeneration.hpp"

TEST_CASE("password is correctly incremented","[password generation]") {
    
    REQUIRE(increment_password("abc") == "abd");
    REQUIRE(increment_password("abz") == "aca");
    REQUIRE(increment_password("cqzzz") == "craaa");
}

TEST_CASE("password is valid if it contains a straight of letters","[password generation]") {
    REQUIRE(is_valid_password("") == false);
    REQUIRE(is_valid_password("ab") == false);
    REQUIRE(is_valid_password("abccff") == true);
    REQUIRE(is_valid_password("abddff") == false);
}

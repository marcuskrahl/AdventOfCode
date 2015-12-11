#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "PasswordGeneration.hpp"

TEST_CASE("password is correctly incremented","[password generation]") {
    
    REQUIRE(increment_password("abc") == "abd");
    REQUIRE(increment_password("abz") == "aca");
    REQUIRE(increment_password("cqzzz") == "craaa");
}

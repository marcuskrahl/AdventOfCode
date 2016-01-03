#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "CodeGeneration.hpp"

TEST_CASE("nth code is correctly generated","[code generation]") {
    REQUIRE(get_code(1) == 20151125);
    REQUIRE(get_code(2) == 31916031);
    REQUIRE(get_code(3) == 18749137);
    REQUIRE(get_code(18) == 21345942);
}

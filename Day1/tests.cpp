#define CATCH_CONFIG_MAIN
#include "catch.hpp"

#include "floor_functions.hpp"

TEST_CASE("Floor is correctly determined","[floor]") {
    REQUIRE(get_destination_floor("") == 0);
    REQUIRE(get_destination_floor("(())") == 0);
    REQUIRE(get_destination_floor("()()") == 0);
    REQUIRE(get_destination_floor("(((") == 3);
    REQUIRE(get_destination_floor("(()(()(") == 3);
    REQUIRE(get_destination_floor("())") == -1);
    REQUIRE(get_destination_floor("))(") == -1);
    REQUIRE(get_destination_floor(")))") == -3);
    REQUIRE(get_destination_floor(")())())") == -3);
}

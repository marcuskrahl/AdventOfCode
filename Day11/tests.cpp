#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "LookAndSay.hpp"

TEST_CASE("look_and_say produces correct output","[look_and_say]") {

    REQUIRE(look_and_say("1") == "11");
    REQUIRE(look_and_say("11") == "21");
    REQUIRE(look_and_say("21") == "1211");
    REQUIRE(look_and_say("1211") == "111221");
    REQUIRE(look_and_say("111221") == "312211");
}

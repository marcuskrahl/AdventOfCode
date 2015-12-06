#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "LightCommand.hpp"

TEST_CASE("turn on inputs are correctly parsed","[input parsing]") {

    auto command = LightCommand::from_input("turn on 0,0 through 999,999");

    REQUIRE(command->get_start_x() == 0);
    REQUIRE(command->get_start_y() == 0);
    REQUIRE(command->get_end_x() == 999);
    REQUIRE(command->get_end_y() == 999);
    REQUIRE(command->perform(10,10,0) == 1);
    REQUIRE(command->perform(10,10,1) == 1);
}


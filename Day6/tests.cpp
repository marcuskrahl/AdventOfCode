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

TEST_CASE("turn off inputs are correctly parsed","[input parsing]") {

    auto command = LightCommand::from_input("turn off 12,34 through 56,78");

    REQUIRE(command->get_start_x() == 12);
    REQUIRE(command->get_start_y() == 34);
    REQUIRE(command->get_end_x() == 56);
    REQUIRE(command->get_end_y() == 78);
    REQUIRE(command->perform(15,15,0) == 0);
    REQUIRE(command->perform(15,15,1) == 0);
}

TEST_CASE("toggle inputs are correctly parsed","[input parsing]") {

    auto command = LightCommand::from_input("toggle 0,0 through 999,999");

    REQUIRE(command->get_start_x() == 0);
    REQUIRE(command->get_start_y() == 0);
    REQUIRE(command->get_end_x() == 999);
    REQUIRE(command->get_end_y() == 999);
    REQUIRE(command->perform(10,10,0) == 1);
    REQUIRE(command->perform(10,10,1) == 0);
}

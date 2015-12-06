#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "LightCommand.hpp"
#include "LightMap.hpp"

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

TEST_CASE("Commands are applied to a light map","[light map]") {
    LightMap light_map;

    REQUIRE(light_map.get_active_lights() == 0);

    light_map.apply_command(*LightCommand::from_input("toggle 50,50 through 51,51"));

    REQUIRE(light_map.get_active_lights() == 4);
}

TEST_CASE("new turn on increases brightness by 1","[input parsing 2]") {
    auto command = LightCommand::from_input("brightness turn on 0,0 through 999,999");

    REQUIRE(command->perform(0,0,0) == 1);
    REQUIRE(command->perform(0,0,1) == 2);
    REQUIRE(command->perform(0,0,7) == 8);
}

TEST_CASE("new turn off decreases brightness by 1","[input parsing 2]") {
    auto command = LightCommand::from_input("brightness turn off 0,0 through 999,999");

    REQUIRE(command->perform(0,0,1) == 0);
    REQUIRE(command->perform(0,0,7) == 6);
    REQUIRE(command->perform(0,0,0) == 0);
}

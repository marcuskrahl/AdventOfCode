#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Seating.hpp"

TEST_CASE("input is correctly parsed","[seating]") {
    auto seating = Seating::from_string("Alice would gain 54 happiness units by sitting next to Bob.");

    REQUIRE(seating.get_first_person() == "Alice");
    REQUIRE(seating.get_second_person() == "Bob");
    REQUIRE(seating.get_value() == 54);
}

TEST_CASE("negative input is correctly parsed","[seating]") {
    auto seating = Seating::from_string("Alice would lose 79 happiness units by sitting next to Carol.");

    REQUIRE(seating.get_first_person() == "Alice");
    REQUIRE(seating.get_second_person() == "Carol");
    REQUIRE(seating.get_value() == -79);
}

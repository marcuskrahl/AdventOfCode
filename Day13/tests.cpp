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

TEST_CASE("maximum happiness is correctly retrieved","[seating]") {
    SeatingPlan plan;

    plan.add_rule(Seating("Alice","Bob",54));
    plan.add_rule(Seating("Alice","Carol",-79));
    plan.add_rule(Seating("Alice","David",-2));
    plan.add_rule(Seating("Bob","Alice",83));
    plan.add_rule(Seating("Bob","Carol",-7));
    plan.add_rule(Seating("Bob","David",-63));
    plan.add_rule(Seating("Carol","Alice",-62));
    plan.add_rule(Seating("Carol","Bob",60));
    plan.add_rule(Seating("Carol","David",55));
    plan.add_rule(Seating("David","Alice",46));
    plan.add_rule(Seating("David","Bob",-7));
    plan.add_rule(Seating("David","Carol",41));

    REQUIRE(plan.get_maximum_happiness() == 330);
}

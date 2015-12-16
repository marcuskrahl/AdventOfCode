#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Aunt.hpp"

TEST_CASE("Aunts are correctly parsed","[aunt]") {
    Aunt aunt1("Sue 1: children: 3, cats: 7, samoyeds: 2, pomeranians: 3, akitas: 0, vizslas: 0, goldfish: 5, trees: 3, cars: 2, perfumes: 1");

    REQUIRE(aunt1.get_value("children") == 3);
    REQUIRE(aunt1.get_value("cats") == 7);
    REQUIRE(aunt1.get_value("samoyeds") == 2);
    REQUIRE(aunt1.get_value("pomeranians") == 3);
    REQUIRE(aunt1.get_value("akitas") == 0);
    REQUIRE(aunt1.get_value("vizslas") == 0);
    REQUIRE(aunt1.get_value("goldfish") == 5);
    REQUIRE(aunt1.get_value("trees") == 3);
    REQUIRE(aunt1.get_value("cars") == 2);
    REQUIRE(aunt1.get_value("perfumes") == 1);

    Aunt aunt2("Sue 22: vizslas: 2, cars: 9, perfumes: 5");
    
    REQUIRE(aunt2.get_value("vizslas") == 2);
    REQUIRE(aunt2.get_value("cars") == 9);
    REQUIRE(aunt2.get_value("perfumes") == 5);
    REQUIRE(aunt2.get_value("akitas") == -1);
}

TEST_CASE("Aunts are equal if they share the same properties","[aunt]") {
    Aunt aunt1("Sue 1: children: 3, cats: 7, samoyeds: 2");
    Aunt aunt2("Sue 2: children: 3, cats: 7, akitas: 3");
    Aunt aunt3("Sue 3: children: 3, cats: 7, samoyeds: 2, akitas: 4");

    REQUIRE( (aunt1 == aunt2) == true);
    REQUIRE( (aunt1 == aunt3) == true);
    REQUIRE( (aunt2 == aunt3) == false);
}

TEST_CASE("Aunts are range equal if they share distinct properties","[aunt]") {
    Aunt target_aunt("Sue 1: cats: 5, trees: 6, pomeranians: 4, goldfish: 3");
    Aunt aunt2("Sue 2: cats: 5");
    Aunt aunt3("Sue 3: cats: 7");
    Aunt aunt4("Sue 4: trees: 6");
    Aunt aunt5("Sue 5: trees: 7");
    Aunt aunt6("Sue 6: pomeranians: 4");
    Aunt aunt7("Sue 7: pomeranians: 3");
    Aunt aunt8("Sue 8: goldfish: 3");
    Aunt aunt9("Sue 9: goldfish: 2");

    REQUIRE( aunt2.range_equals(target_aunt) == false);
    REQUIRE( aunt3.range_equals(target_aunt) == true);
    REQUIRE( aunt4.range_equals(target_aunt) == false);
    REQUIRE( aunt5.range_equals(target_aunt) == true);
    REQUIRE( aunt6.range_equals(target_aunt) == false);
    REQUIRE( aunt7.range_equals(target_aunt) == true);
    REQUIRE( aunt8.range_equals(target_aunt) == false);
    REQUIRE( aunt9.range_equals(target_aunt) == true);
}

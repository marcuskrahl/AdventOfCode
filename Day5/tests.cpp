#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "naughty_or_nice.hpp"

TEST_CASE("Word is nice if it has at least three vowels","[naughty or nice]") {
    REQUIRE(is_nice("") == false);
    REQUIRE(is_nice("ae") == false);
    REQUIRE(is_nice("aee") == true); 
}

TEST_CASE("Word is nice if it has at least one double letter","[naughty or nice]") {
    REQUIRE(is_nice("aeu") == false);
    REQUIRE(is_nice("aeuu") == true);
    REQUIRE(is_nice("addeu") == true);
}

TEST_CASE("Word is nice if it does not contain restricted sequences","[naughty or nice]") {
    REQUIRE(is_nice("addeu") == true);
    REQUIRE(is_nice("acddeu") == false);
    REQUIRE(is_nice("abddeu") == false);
    REQUIRE(is_nice("apqddeu") == false);
    REQUIRE(is_nice("axyddeu") == false);
    REQUIRE(is_nice("axzddeu") == true);
}

TEST_CASE("Word is nice if it contains a repeating character double","[naughty or nice 2]") {
    REQUIRE(is_nice2("") == false);
    REQUIRE(is_nice2("aaa") == false);
    REQUIRE(is_nice2("aaeaa") == true);
    REQUIRE(is_nice2("bqjcdcxabwqja") == true);

}

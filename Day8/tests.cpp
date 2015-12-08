#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Santa_StringLength.hpp"

TEST_CASE("string length is correctly calculated","[string length]") {
    
    REQUIRE(string_length("\"\"") == 2);
    REQUIRE(string_length("\"abc\"") == 5);
    REQUIRE(string_length("\"\\\"\\\\\\x32\"") == 10);
}

TEST_CASE("memory length ignores start and end quote","[memory length]") {
    REQUIRE(memory_length("\"\"") == 0);
    REQUIRE(memory_length("\"abc\"") == 3);
}

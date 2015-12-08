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

TEST_CASE("memory length reduces double slash to one character","[memory length]") {
    REQUIRE(memory_length("\"\\\\\"") == 1);
    REQUIRE(memory_length("\"ab\\\\c\"") == 4);
    REQUIRE(memory_length("\"\\\\\\\\\"") == 2);
}

TEST_CASE("memory length reduces escaped quote to one character","[memory length]") {
    REQUIRE(memory_length("\"\\\"\"") == 1);
    REQUIRE(memory_length("\"ab\\\"c\"") == 4);
    REQUIRE(memory_length("\"\\\"\\\"\"") == 2);
}

TEST_CASE("memory length reduces escaped hex char to one character","[memory length]") {
    REQUIRE(memory_length("\"\\x23\"") == 1);
    REQUIRE(memory_length("\"ab\\x23c\"") == 4);
    REQUIRE(memory_length("\"\\x23\\x45\"") == 2);
}

TEST_CASE("encoded length escapes quotes","[encoded length]") {
    REQUIRE(encoded_length("\"\"") == 6);
    REQUIRE(encoded_length("\"abc\"") == 9);
}

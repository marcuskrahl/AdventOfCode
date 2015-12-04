#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "md5.hpp"

TEST_CASE("md5 value is correctly calculated","[md5]") {
    REQUIRE(md5("") == "d41d8cd98f00b204e9800998ecf8427e");
    REQUIRE(md5("abcdef609043") == "000001dbbfa3a5c83a2d506429c7b00e");
}

TEST_CASE("lowest value with zeroes at the beginning of md5 sum is found","[md5 search]") {
    REQUIRE(find_lowest_zeroes_value("abcdef",5) == 609043);
}

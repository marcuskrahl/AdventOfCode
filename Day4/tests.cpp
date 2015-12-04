#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "md5.hpp"

TEST_CASE("md5 value is correctly calculated","[md5]") {
    REQUIRE(md5("") == "d41d8cd98f00b204e9800998ecf8427e");
}

#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "JSONAnalysis.hpp"

TEST_CASE("Numbers are correctly summed","[number sum]") {
    REQUIRE(get_sum_of_numbers("[]") == 0);
    REQUIRE(get_sum_of_numbers("{}") == 0);
    REQUIRE(get_sum_of_numbers("[1,2,3]") == 6);
    REQUIRE(get_sum_of_numbers("{\"a\":2,\"b\":4}") == 6);
    REQUIRE(get_sum_of_numbers("[[[3]]]") == 3);
    REQUIRE(get_sum_of_numbers("{\"a\":{\"b\":4},\"c\":-1}") == 3);
    REQUIRE(get_sum_of_numbers("{\"a\":[-1,1]}") == 0);
    REQUIRE(get_sum_of_numbers("[-1,{\"a\":1}]") == 0);
}

TEST_CASE("Numbers without red are correctly summed","[number sum]") {
    REQUIRE(get_sum_of_numbers_without_red("[1,2,3]") == 6);
    REQUIRE(get_sum_of_numbers_without_red("[1,{\"c\":\"red\",\"b\":2},3]") == 4);
    REQUIRE(get_sum_of_numbers_without_red("{\"d\":\"red\",\"e\":[1,2,3,4],\"f\":5}") == 0);
    REQUIRE(get_sum_of_numbers_without_red("[1,\"red\",5]") == 6);
}

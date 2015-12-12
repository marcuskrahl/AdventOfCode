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

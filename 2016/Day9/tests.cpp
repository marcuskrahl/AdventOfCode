#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "RouteCalculation.hpp"

TEST_CASE("shortest route is correctly calculated for simple route","[route calculation]") {
    RouteCalculation routeCalculation;

    routeCalculation.add_connection("A to B = 3");
    routeCalculation.add_connection("A to C = 2");
    routeCalculation.add_connection("B to C = 0");
    routeCalculation.add_connection("B to D = 2");
    routeCalculation.add_connection("C to D = 2");

    REQUIRE (routeCalculation.get_shortest_route() == 4);

}

TEST_CASE("longest route is correctly calculated for simple route","[route calculation]") {
    RouteCalculation routeCalculation;

    routeCalculation.add_connection("A to B = 3");
    routeCalculation.add_connection("A to C = 2");
    routeCalculation.add_connection("B to C = 0");
    routeCalculation.add_connection("B to D = 2");
    routeCalculation.add_connection("C to D = 2");

    REQUIRE (routeCalculation.get_longest_route() == 7);

}

#include "RouteCalculation.hpp"

#include <algorithm>
#include <regex>

std::regex input_regex("(\\w+) to (\\w+) = (\\d+)");

void RouteCalculation::add_connection(const std::string& input) {
    std::smatch match;
    if (!std::regex_match(input,match,input_regex)) {
        throw "invalid input";
    }
    Route route(match[1],match[2],std::stoul(match[3]));
    routes.push_back(route);
}

unsigned int RouteCalculation::calculate_cost_of_route_part(const std::string& first_route_point, const std::string& second_route_point) const {
    for(auto route: routes) {
        if (((first_route_point == route.from) && (second_route_point == route.to)) 
            || ((first_route_point == route.to) && (second_route_point == route.from))) {
            return route.cost;
        }
    }
    return 999999;
}

unsigned int RouteCalculation::calculate_cost_of_route(const std::vector<std::string> route_points) const {
   auto first_route_point = route_points.begin();
   if (first_route_point == route_points.end()) {
        return 0;
   }
   auto second_route_point = route_points.begin() + 1;
   unsigned int route_length = 0;
   while(second_route_point != route_points.end()) {
        unsigned int length_of_route_part = RouteCalculation::calculate_cost_of_route_part(*first_route_point, *second_route_point);
        route_length += length_of_route_part;
        first_route_point++;
        second_route_point++;
   }
   return route_length;
}

std::vector<std::string> RouteCalculation::get_route_points() const {
    std::vector<std::string> output;
    for (auto route: routes) {
        if (std::find(output.begin(),output.end(),route.from) == output.end() ) {
            output.push_back(route.from);
        }
        if (std::find(output.begin(),output.end(),route.to) == output.end() ) {
            output.push_back(route.to);
        }
    }
    return output;

}
unsigned int RouteCalculation::get_shortest_route() const {
    std::vector<std::string> route_points = get_route_points();
    //std::vector<std::string> best_route;
    unsigned int best_route_cost = 999999;
    do {
        unsigned int cost = calculate_cost_of_route(route_points);
        if (cost < best_route_cost) {
            best_route_cost = cost;
            //best_route = route_points;
        }
    } while (std::next_permutation(route_points.begin(),route_points.end()));

    return best_route_cost;
}

Route::Route(const std::string& from, const std::string& to, unsigned int cost) : from(from), to(to), cost(cost) {

}


#ifndef ROUTE_CALCULATION_HPP
#define ROUTE_CALCULATION_HPP

#include <string>
#include <vector>


class Route {
    public:
        Route(const std::string& from, const std::string& to, unsigned int cost);
        std::string from;
        std::string to;
        unsigned int cost;
};

class RouteCalculation {
    public:
        void add_connection(const std::string& input);
        unsigned int get_shortest_route() const;
        unsigned int get_longest_route() const;
    private:
        std::vector<Route> routes;
        unsigned int calculate_cost_of_route_part(const std::string& first_route_point, const std::string& second_route_point) const;
        unsigned int calculate_cost_of_route(const std::vector<std::string> route_points) const; 
        std::vector<std::string> get_route_points() const; 
};

#endif

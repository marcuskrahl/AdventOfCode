#ifndef ROUTE_CALCULATION_HPP
#define ROUTE_CALCULATION_HPP

#include <string>

class RouteCalculation {
    public:
        void add_connection(const std::string& input);
        unsigned int get_shortest_route() const;
};

#endif

#ifndef CIRCUIT_HPP
#define CIRCUIT_HPP

#include <map>
#include <string>
#include <memory>

#include "Command.hpp"

class Node {
    public:
        const std::string id;
        const std::shared_ptr<Command> command;
        const std::string parent_id_1;
        const std::string parent_id_2;

        Node(const std::string& id, std::shared_ptr<Command> command, const std::string& parent_id_1, const std::string& parent_id_2);
};

class Circuit {
    public:
        void add_node(Node node);
        void add_node(const std::string& input);
        unsigned short get_value(const std::string& node_id);
    private:
        std::map<std::string,Node> nodes;
        std::map<std::string,unsigned short> stored_values;
};


#endif

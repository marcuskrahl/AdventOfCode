#include "Circuit.hpp"

#include <regex>

std::regex command_regex("([a-z]*) ?([A-Z]+) (.*) -> ([a-z]+)");
std::regex assign_regex("(\\d+) -> ([a-z]+)");

void Circuit::add_node(Node node) {
    nodes.insert(std::pair<std::string, Node> (node.id, node));
}

void Circuit::add_node(const std::string& input) {
    std::smatch match_1;
    if ( std::regex_match(input,match_1, assign_regex)) {
        add_node(Node(match_1[2],std::make_shared<ValueCommand>(std::stoi(match_1[1])),"",""));
        return;
    }

    std::smatch match;
    if ( ! std::regex_match(input,match,command_regex)) {
        throw "invalid input";
    }
    if (match[2] == "AND") {
        add_node(Node(match[4],std::make_shared<AndCommand>(),match[1],match[3]));
    } else if (match[2] == "OR") {
        add_node(Node(match[4],std::make_shared<OrCommand>(),match[1],match[3]));
    } else if (match[2] == "LSHIFT") {
        add_node(Node(match[4],std::make_shared<LShiftCommand>(std::stoi(match[3])),match[1],""));
    } else if (match[2] == "RSHIFT") {
        add_node(Node(match[4],std::make_shared<RShiftCommand>(std::stoi(match[3])),match[1],""));
    } else if (match[2] == "NOT") {
        add_node(Node(match[4],std::make_shared<NotCommand>(),match[3],""));
    }
     
}

unsigned short Circuit::get_value(const std::string& node_id) {
    const Node& node = nodes.find(node_id)->second;
    unsigned short parent_value_1 = node.parent_id_1 == "" ? 0 : get_value(node.parent_id_1);
    unsigned short parent_value_2 = node.parent_id_2 == "" ? 0 : get_value(node.parent_id_2);
    return node.command->evaluate(parent_value_1,parent_value_2);
}


Node::Node(const std::string& id, std::shared_ptr<Command> command, const std::string& parent_id_1, const std::string& parent_id_2) : id(id), command(command), parent_id_1(parent_id_1), parent_id_2(parent_id_2) {
}

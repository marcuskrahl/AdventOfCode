#include "Circuit.hpp"

void Circuit::add_node(Node node) {
    nodes.insert(std::pair<std::string, Node> (node.id, node));
}

unsigned short Circuit::get_value(const std::string& node_id) {
    const Node& node = nodes.find(node_id)->second;
    unsigned short parent_value_1 = node.parent_id_1 == "" ? 0 : get_value(node.parent_id_1);
    unsigned short parent_value_2 = node.parent_id_2 == "" ? 0 : get_value(node.parent_id_2);
    return node.command->evaluate(parent_value_1,parent_value_2);
}


Node::Node(const std::string& id, std::shared_ptr<Command> command, const std::string& parent_id_1, const std::string& parent_id_2) : id(id), command(command), parent_id_1(parent_id_1), parent_id_2(parent_id_2) {
}

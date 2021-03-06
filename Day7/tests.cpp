#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Command.hpp"
#include "Circuit.hpp"

TEST_CASE("circuit commands work as expected","[circuit evaluation]") {
    AndCommand andCommand;

    REQUIRE (andCommand.evaluate(5,3) == 1);

    LShiftCommand lShiftCommand(2);

    REQUIRE (lShiftCommand.evaluate(3,0) == 12); 

    RShiftCommand rShiftCommand(2);

    REQUIRE (rShiftCommand.evaluate(13,0) == 3);

    NotCommand notCommand;

    REQUIRE (notCommand.evaluate((unsigned short) 0x00ff,0) == (unsigned short) 0xff00);

    OrCommand orCommand;

    REQUIRE ( orCommand.evaluate(3,5) == 7);

    ValueCommand valueCommand(8);

    REQUIRE ( valueCommand.evaluate(0,0) == 8);

    EqualsCommand equalsCommand;

    REQUIRE ( equalsCommand.evaluate(42,0) == 42);

}

TEST_CASE("circuit is evaluated correctly","[circuit evaluation]") {
    Circuit circuit;

    circuit.add_node(Node("x",std::make_shared<ValueCommand>(123),"",""));
    circuit.add_node(Node("y",std::make_shared<ValueCommand>(456),"",""));
    circuit.add_node(Node("d",std::make_shared<AndCommand>(),"x","y"));
    circuit.add_node(Node("e",std::make_shared<OrCommand>(),"x","y"));
    circuit.add_node(Node("f",std::make_shared<LShiftCommand>(2),"x",""));
    circuit.add_node(Node("g",std::make_shared<RShiftCommand>(2),"y",""));
    circuit.add_node(Node("h",std::make_shared<NotCommand>(),"x",""));
    circuit.add_node(Node("i",std::make_shared<NotCommand>(),"y",""));
    
    REQUIRE ( circuit.get_value("d") == 72);
    REQUIRE ( circuit.get_value("e") == 507);
    REQUIRE ( circuit.get_value("f") == 492);
    REQUIRE ( circuit.get_value("g") == 114);
    REQUIRE ( circuit.get_value("h") == 65412);
    REQUIRE ( circuit.get_value("i") == 65079);
}


TEST_CASE("circuit can be built with strings","[circuit evaluation]") {
    Circuit circuit;

    circuit.add_node("123 -> x");
    circuit.add_node("456 -> y");
    circuit.add_node("x AND y -> d");
    circuit.add_node("x OR y -> e");
    circuit.add_node("x LSHIFT 2 -> f");
    circuit.add_node("y RSHIFT 2 -> g");
    circuit.add_node("NOT x -> h");
    circuit.add_node("NOT y -> i");
    circuit.add_node("1 AND x -> j");
    circuit.add_node("x -> k");
    
    REQUIRE ( circuit.get_value("d") == 72);
    REQUIRE ( circuit.get_value("e") == 507);
    REQUIRE ( circuit.get_value("f") == 492);
    REQUIRE ( circuit.get_value("g") == 114);
    REQUIRE ( circuit.get_value("h") == 65412);
    REQUIRE ( circuit.get_value("i") == 65079);
    REQUIRE ( circuit.get_value("j") == 1);
    REQUIRE ( circuit.get_value("k") == 123);
}

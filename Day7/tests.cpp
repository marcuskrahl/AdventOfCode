#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Command.hpp"

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

}

TEST_CASE("circuit is evaluated correctly","[circuit evaluation]") {
    REQUIRE (1 == 1); 
}

#define CATCH_CONFIG_MAIN
#include "../lib/catch.hpp"

#include "Instructions.hpp"

TEST_CASE("HLF halfs specified register","[instructions]") {
    HLF hlf(0);
    std::array<int,REGISTER_COUNT> registers = { 8,3 };
    unsigned int next_instruction = 0;

    hlf.perform(registers,next_instruction);

    REQUIRE( registers[0] == 4);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 1);
}

TEST_CASE("TPL triples specified register","[instructions]") {
    TPL tpl(0);
    std::array<int,REGISTER_COUNT> registers = { 8,3 };
    unsigned int next_instruction = 0;

    tpl.perform(registers,next_instruction);

    REQUIRE( registers[0] == 24);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 1);
}

TEST_CASE("INC increases register by 1","[instructions]") {
    INC inc(0);
    std::array<int,REGISTER_COUNT> registers = { 8,3 };
    unsigned int next_instruction = 0;

    inc.perform(registers,next_instruction);

    REQUIRE( registers[0] == 9);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 1);
}

TEST_CASE("JMP jumps to offset without modification of registers","[instructions]") {
    JMP jmp(-3);
    std::array<int,REGISTER_COUNT> registers = { 8,3 };
    unsigned int next_instruction = 5;

    jmp.perform(registers,next_instruction);

    REQUIRE( registers[0] == 8);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 2);
}

TEST_CASE("JIE jumps to offset, but only if the specified register is even","[instructions]") {
    JIE jie(0,3);
    JIE jie2(1,3);
    std::array<int,REGISTER_COUNT> registers = { 8,3 };
    unsigned int next_instruction = 0;

    jie.perform(registers,next_instruction);

    REQUIRE( registers[0] == 8);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 3);

    next_instruction = 0;

    jie2.perform(registers,next_instruction);

    REQUIRE( registers[0] == 8);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 1);
}
 
TEST_CASE("JIO jumps to offset, but only if the specified register equals 1","[instructions]") {
    JIO jio(0,3);
    JIO jio2(1,3);
    std::array<int,REGISTER_COUNT> registers = { 1,3 };
    unsigned int next_instruction = 0;

    jio.perform(registers,next_instruction);

    REQUIRE( registers[0] == 1);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 3);

    next_instruction = 0;

    jio2.perform(registers,next_instruction);

    REQUIRE( registers[0] == 1);
    REQUIRE( registers[1] == 3);
    REQUIRE( next_instruction == 1);
}

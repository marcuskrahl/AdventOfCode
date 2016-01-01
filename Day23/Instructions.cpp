#include "Instructions.hpp"

HLF::HLF(size_t register_to_modify) : register_to_modify(register_to_modify) {

}

void HLF::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    registers[register_to_modify] = registers[register_to_modify] / 2;
    next_instruction++;
}

TPL::TPL(size_t register_to_modify) : register_to_modify(register_to_modify) {

}

void TPL::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    registers[register_to_modify] = registers[register_to_modify] * 3;
    next_instruction++;
}

INC::INC(size_t register_to_modify) : register_to_modify(register_to_modify) {

}

void INC::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    registers[register_to_modify] = registers[register_to_modify] + 1;
    next_instruction++;
}

JMP::JMP(int jump_offset) : jump_offset(jump_offset) {

}

void JMP::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    next_instruction += jump_offset; 
}

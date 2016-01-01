#include "Instructions.hpp"

HLF::HLF(size_t register_to_modify) : register_to_modify(register_to_modify) {

}

void HLF::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    registers[register_to_modify] = registers[register_to_modify] / 2;
    next_instruction++;
}

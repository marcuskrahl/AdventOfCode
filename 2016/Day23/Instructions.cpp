#include "Instructions.hpp"

#include "regex"

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

JIE::JIE(size_t referenced_register, int jump_offset) : referenced_register(referenced_register), jump_offset(jump_offset) {

}

void JIE::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    if ((registers[referenced_register] % 2) == 0) {
        next_instruction += jump_offset; 
    } else {
        next_instruction++;
    }
}

JIO::JIO(size_t referenced_register, int jump_offset) : referenced_register(referenced_register), jump_offset(jump_offset) {

}

void JIO::perform(std::array<int,REGISTER_COUNT>& registers, unsigned int& next_instruction) {
    if (registers[referenced_register]  == 1) {
        next_instruction += jump_offset; 
    } else {
        next_instruction++;
    }
}
 
std::regex instruction_regex("(\\w+) (.+)");
std::regex extended_jump_regex("(\\w), (.+)");

size_t get_register_number(const std::string& register_string) {
    return register_string[0] - 'a';
}


std::shared_ptr<Instruction> parse_instruction(const std::string& input) {
    std::smatch match;
    if(! std::regex_match(input,match,instruction_regex)) {
        throw "invalid instruction";
    }
    if (match[1] == "hlf") {
        return std::make_shared<HLF>(get_register_number(match[2]));
    }
    if (match[1] == "tpl") {
        return std::make_shared<TPL>(get_register_number(match[2]));
    }
    if (match[1] == "inc") {
        return std::make_shared<INC>(get_register_number(match[2]));
    }
    if (match[1] == "jmp") {
        return std::make_shared<JMP>(std::stoi(match[2]));
    }
    std::smatch extended_jump_match;
    std::string rest = match[2];
    if (! std::regex_match(rest,extended_jump_match,extended_jump_regex)) {
        throw "invalid extended jump";
    }
    if (match[1] == "jie") {
        return std::make_shared<JIE>(get_register_number(extended_jump_match[1]),std::stoi(extended_jump_match[2]));
    }
    if (match[1] == "jio") {
        return std::make_shared<JIO>(get_register_number(extended_jump_match[1]),std::stoi(extended_jump_match[2]));
    }
    throw "unknown instruction";
}

void InstructionRunner::add_instruction(std::shared_ptr<Instruction> instruction) {
    instructions.push_back(instruction);
}

void InstructionRunner::run(std::array<int,REGISTER_COUNT>& registers) {
    unsigned int current_instruction = 0;
    unsigned int instruction_count = instructions.size();
    while (current_instruction < instruction_count) {
        instructions[current_instruction]->perform(registers,current_instruction);
    }
}

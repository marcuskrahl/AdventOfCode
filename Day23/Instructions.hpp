#ifndef INSTRUCTIONS_HPP
#define INSTRUCTIONS_HPP

#define REGISTER_COUNT 2

#include <array>
#include <memory>
#include <string>
#include <vector>

class Instruction {
    public:
        virtual void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction) = 0;
};

class HLF : public Instruction {
    public:
        HLF(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class TPL : public Instruction { 
    public:
        TPL(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class INC : public Instruction {
    public:
        INC(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class JMP : public Instruction {
    public:
        JMP(int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        int jump_offset;
};

class JIE : public Instruction {
    public:
        JIE(size_t referenced_register, int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t referenced_register;
        int jump_offset;
};

class JIO : public Instruction {
    public:
        JIO(size_t referenced_register, int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t referenced_register;
        int jump_offset;
};

class InstructionRunner {
    public:
        void add_instruction(std::shared_ptr<Instruction> instruction);
        void run(std::array<int,REGISTER_COUNT> &registers);
    private:
        std::vector<std::shared_ptr<Instruction>> instructions;

};
std::shared_ptr<Instruction> parse_instruction(const std::string& input);

#endif

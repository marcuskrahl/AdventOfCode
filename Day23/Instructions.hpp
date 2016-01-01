#ifndef INSTRUCTIONS_HPP
#define INSTRUCTIONS_HPP

#define REGISTER_COUNT 2

#include <array>

class HLF {
    public:
        HLF(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class TPL {
    public:
        TPL(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class INC {
    public:
        INC(size_t register_to_modify);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t register_to_modify;
};

class JMP {
    public:
        JMP(int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        int jump_offset;
};

class JIE {
    public:
        JIE(size_t referenced_register, int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t referenced_register;
        int jump_offset;
};

class JIO {
    public:
        JIO(size_t referenced_register, int jump_offset);
        void perform(std::array<int,REGISTER_COUNT> &registers, unsigned int &next_instruction);
    private:
        size_t referenced_register;
        int jump_offset;
};

#endif

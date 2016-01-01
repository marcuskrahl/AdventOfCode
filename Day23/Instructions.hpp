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

#endif

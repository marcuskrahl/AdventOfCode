#include "Command.hpp"

unsigned short AndCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return value1 & value2;
}

LShiftCommand::LShiftCommand(unsigned short shift_value) : shift_value(shift_value) {
}
unsigned short LShiftCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return value1 << shift_value;
}

RShiftCommand::RShiftCommand(unsigned short shift_value) : shift_value(shift_value) {
}
unsigned short RShiftCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return value1 >> shift_value;
}

unsigned short OrCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return value1 | value2;
}

unsigned short NotCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return ~value1;
}

ValueCommand::ValueCommand(unsigned short value) : value(value) {
}

unsigned short ValueCommand::evaluate(unsigned short value1, unsigned short value2) const {
    return value;
}

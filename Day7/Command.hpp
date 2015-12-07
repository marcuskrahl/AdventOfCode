#ifndef COMMANDS_HPP
#define COMMANDS_HPP

class Command {
    public: 
        virtual unsigned short evaluate(unsigned short input1, unsigned short input2) const = 0;
};

class AndCommand: public Command {
    public:
        unsigned short evaluate (unsigned short input1, unsigned short input2) const;
};
class OrCommand: public Command {
    public:
        unsigned short evaluate (unsigned short input1, unsigned short input2) const;
};
class LShiftCommand: public Command {
    public:
        LShiftCommand(unsigned short shift_value);
        unsigned short evaluate (unsigned short input1, unsigned short input2) const;
    private:
        unsigned short shift_value;
};
class RShiftCommand: public Command {
    public:
        RShiftCommand(unsigned short shift_value);
        unsigned short evaluate (unsigned short input1, unsigned short input2) const;
    private:
        unsigned short shift_value;
};
class NotCommand: public Command {
    public:
        unsigned short evaluate (unsigned short input1, unsigned short input2) const;
};
class ValueCommand: public Command {
    public:
        ValueCommand(unsigned short value);
        unsigned short evaluate(unsigned short input1, unsigned short input2) const;
    private:
        unsigned short value;
};


#endif

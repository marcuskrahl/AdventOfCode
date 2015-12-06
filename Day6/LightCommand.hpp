#ifndef LIGHT_COMMAND_HPP
#define LIGHT_COMMAND_HPP

#include <string>
#include <memory>

class LightCommand {
    public:
        LightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y);
        unsigned int get_start_x() const;
        unsigned int get_start_y() const;
        unsigned int get_end_x() const;
        unsigned int get_end_y() const;
        virtual unsigned char perform(unsigned int x, unsigned int y, unsigned char previous_value) const = 0;
        static std::unique_ptr<LightCommand> from_input(const std::string& input);
    private:
        unsigned int start_x;
        unsigned int start_y;
        unsigned int end_x;
        unsigned int end_y;
};

class TurnOnLightCommand : public LightCommand {
    public:
        TurnOnLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y);
        virtual unsigned char perform(unsigned int x, unsigned int y, unsigned char previous_value) const;
};

class TurnOffLightCommand : public LightCommand {
    public:
        TurnOffLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y);
        virtual unsigned char perform(unsigned int x, unsigned int y, unsigned char previous_value) const;
};


#endif

#include "LightCommand.hpp"

#include <regex>

LightCommand::LightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    start_x(start_x), start_y(start_y), end_x(end_x), end_y(end_y) {

}

unsigned int LightCommand::get_start_x() const {
    return start_x;
}

unsigned int LightCommand::get_start_y() const {
    return start_y;
}

unsigned int LightCommand::get_end_x() const {
    return end_x;
}

unsigned int LightCommand::get_end_y() const {
    return end_y;
}

std::regex command_regex("(\\D+) (\\d+),(\\d+) through (\\d+),(\\d+)");


TurnOnLightCommand::TurnOnLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char TurnOnLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    return 1;
}

TurnOffLightCommand::TurnOffLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char TurnOffLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    return 0;
}

ToggleLightCommand::ToggleLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char ToggleLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    return previous_value == 0 ? 1 : 0;
}

BrightnessTurnOnLightCommand::BrightnessTurnOnLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char BrightnessTurnOnLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    return previous_value + 1;
}

BrightnessTurnOffLightCommand::BrightnessTurnOffLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char BrightnessTurnOffLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    if (previous_value > 0) {
        return previous_value - 1;
    } else {
        return 0;
    }
}

BrightnessToggleLightCommand::BrightnessToggleLightCommand(unsigned int start_x, unsigned int start_y, unsigned int end_x, unsigned int end_y) : 
    LightCommand(start_x,start_y,end_x,end_y) {

}

unsigned char BrightnessToggleLightCommand::perform(unsigned int x, unsigned int y, unsigned char previous_value) const {
    return previous_value + 2;
}



std::unique_ptr<LightCommand> LightCommand::from_input(const std::string& input) {
    std::smatch match;
    if ( ! std::regex_match(input,match,command_regex)) {
        throw "invalid input";
    }
    unsigned int start_x = std::stoul(match[2]);
    unsigned int start_y = std::stoul(match[3]);
    unsigned int end_x = std::stoul(match[4]);
    unsigned int end_y = std::stoul(match[5]);
    std::string command = match[1];
    
    if (command == "turn on") {
        return std::unique_ptr<LightCommand>(new TurnOnLightCommand(start_x,start_y,end_x,end_y));
    } else if (command == "turn off") {
        return std::unique_ptr<LightCommand>(new TurnOffLightCommand(start_x,start_y,end_x,end_y));
    } else if (command == "toggle") {
        return std::unique_ptr<LightCommand>(new ToggleLightCommand(start_x,start_y,end_x,end_y));
    }  else if (command == "brightness turn on") {
        return std::unique_ptr<LightCommand>(new BrightnessTurnOnLightCommand(start_x,start_y,end_x,end_y));
    } else if (command == "brightness turn off") {
        return std::unique_ptr<LightCommand>(new BrightnessTurnOffLightCommand(start_x,start_y,end_x,end_y));
    } else if (command == "brightness toggle") {
        return std::unique_ptr<LightCommand>(new BrightnessToggleLightCommand(start_x,start_y,end_x,end_y));
    } else {
        throw "invalid command";
    }
}


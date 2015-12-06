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
    } else {
        throw "invalid command";
    }
}

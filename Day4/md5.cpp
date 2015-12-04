#include "md5.hpp"

#include <sstream>
#include <iomanip>
#include <openssl/md5.h>

#define MD5_OUTPUT_LENGTH 16

std::string output_to_hex_string(unsigned char *output);

std::string md5(const std::string& input) {
    unsigned char output[MD5_OUTPUT_LENGTH];
    MD5((const unsigned char *) input.c_str(), input.length(), output);
    return output_to_hex_string(output);
}

std::string output_to_hex_string(unsigned char *output) {
    std::stringstream hex_stream;
    hex_stream << std::hex;
    for (unsigned int i=0; i< MD5_OUTPUT_LENGTH; i++) {
        hex_stream << std::setfill('0') << std::setw(2) << (int) output[i];
    }
    return hex_stream.str();
}

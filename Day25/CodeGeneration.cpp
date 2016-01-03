#include "CodeGeneration.hpp"

unsigned long get_code(unsigned int n) {
    if (n == 1) {
        return 20151125ul;
    } else {
        return (get_code(n-1) * 252533ul) % 33554393ul;
    }
}

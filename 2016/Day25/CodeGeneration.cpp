#include "CodeGeneration.hpp"

unsigned long get_code(unsigned int n) {
    unsigned long code = 20151125ul;
    while (n-- > 1) {
        code = (code * 252533ul) % 33554393ul;

    }
    return code;
}

unsigned long get_code(unsigned int row, unsigned int column) {
    unsigned int n = 1;
    unsigned int step = 1;
    while (--row > 0) {
        n+= step;
        step++;
    }
    step++;
    while (--column > 0) {
        n+= step;
        step++;
    }
    return get_code(n);
}

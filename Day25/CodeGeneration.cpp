#include "CodeGeneration.hpp"

unsigned long get_code(unsigned int n) {
    if (n == 1) {
        return 20151125ul;
    } else {
        return (get_code(n-1) * 252533ul) % 33554393ul;
    }
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

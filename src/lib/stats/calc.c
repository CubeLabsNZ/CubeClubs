#include <stdio.h>
#include "emscripten.h"


int main() {
    printf("loaded!\n");
    return 0;
}

EMSCRIPTEN_KEEPALIVE int yes() {
    return 2;
}

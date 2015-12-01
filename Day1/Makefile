all: main.cpp
	g++ -g -std=c++14 -Wall -o day1 main.cpp floor_functions.cpp

clean:
	$(RM) day1 day1_tests

test:
	g++ -g -std=c++14 -Wall -o day1_tests tests.cpp floor_functions.cpp
	./day1_tests

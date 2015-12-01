all: main.cpp
	g++ -g -std=c++14 -Wall -o day1 main.cpp 

clean:
	$(RM) day1 day1_tests

test:
	g++ -g -std=c++14 -Wall -o day1_tests tests.cpp get_destination_floor.cpp
	./day1_tests

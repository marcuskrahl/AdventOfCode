DAY = day2
SOURCE_FILES = 

all: main.cpp
	g++ -g -std=c++14 -Wall -o $(DAY) main.cpp $(SOURCE_FILES)

clean:
	$(RM) $(DAY) $(DAY)_tests

test:
	g++ -g -std=c++14 -Wall -o $(DAY)_tests tests.cpp $(SOURCE_FILES)
	./$(DAY)_tests

DAY = day6
SOURCE_FILES = LightCommand.cpp LightMap.cpp
LIBRARIES = 

all: main.cpp
	g++ -g -std=c++14 -Wall $(LIBRARIES) -o $(DAY) main.cpp $(SOURCE_FILES)

clean:
	$(RM) $(DAY) $(DAY)_tests

test:
	g++ -g -std=c++14 -Wall $(LIBRARIES) -o $(DAY)_tests tests.cpp $(SOURCE_FILES)
	./$(DAY)_tests

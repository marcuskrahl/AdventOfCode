DAY = day20
LIBRARIES = PresentDistribution.cpp

all: main.cpp
	g++ -g -std=c++14 -O2 -Wall $(LIBRARIES) -o $(DAY) main.cpp $(SOURCE_FILES)

clean:
	$(RM) $(DAY) $(DAY)_tests

test:
	g++ -g -std=c++14 -Wall $(LIBRARIES) -o $(DAY)_tests tests.cpp $(SOURCE_FILES)
	./$(DAY)_tests

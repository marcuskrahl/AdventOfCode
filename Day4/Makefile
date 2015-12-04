DAY = day4
SOURCE_FILES = md5.cpp
LIBRARIES = -lssl -lcrypto

all: main.cpp
	g++ -g -std=c++14 -Wall $(LIBRARIES) -o $(DAY) main.cpp $(SOURCE_FILES)

clean:
	$(RM) $(DAY) $(DAY)_tests

test:
	g++ -g -std=c++14 -Wall $(LIBRARIES) -o $(DAY)_tests tests.cpp $(SOURCE_FILES)
	./$(DAY)_tests

module Day6_Tests

open System
open Xunit
open Day6


let input = [ "3,4,3,1,2" ]

[<Fact>]
let ``step advances population one step`` () =
    let initialPopulation = {
        gen0 = 2L;
        gen1 = 3L;
        gen2 = 4L;
        gen3 = 5L;
        gen4 = 6L;
        gen5 = 7L;
        gen6 = 8L;
        gen7 = 9L;
        gen8 = 10L
    }
    let result = step initialPopulation
    let expectedResult = {
        gen0 = 3L;
        gen1 = 4L;
        gen2 = 5L;
        gen3 = 6L;
        gen4 = 7L;
        gen5 = 8L;
        gen6 = 11L;
        gen7 = 10L;
        gen8 = 2L
    }
    Assert.Equal(expectedResult, result)

[<Fact>]
let ``parse population`` () =
    let result = parsePopulation "3,4,3,1,2"
    let expectedResult = {
        gen0 = 0L;
        gen1 = 1L;
        gen2 = 1L;
        gen3 = 2L;
        gen4 = 1L;
        gen5 = 0L;
        gen6 = 0L;
        gen7 = 0L;
        gen8 = 0L
    }
    Assert.Equal(expectedResult, result)

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(5934L, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(26984457539L, result)



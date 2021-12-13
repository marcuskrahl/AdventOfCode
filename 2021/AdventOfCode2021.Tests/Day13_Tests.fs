module Day13_Tests

open System
open Xunit
open Day13

let input = [
        "6,10";
        "0,14";
        "9,10";
        "0,3";
        "10,4";
        "4,11";
        "6,0";
        "6,12";
        "4,1";
        "0,13";
        "10,12";
        "3,4";
        "3,0";
        "8,4";
        "1,10";
        "2,14";
        "8,10";
        "9,0";
        "";
        "fold along y=7";
        "fold along x=5";
    ]

[<Fact>]
let ``parseInput returns correct result`` () =
    let result = parseInput (input |> List.skip 16)
    let expectedResult = (
        [(8,10); (9,0)],
        [Y(7); X(5)]
    )
    Assert.Equal(expectedResult, result)


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(17, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(42, result)

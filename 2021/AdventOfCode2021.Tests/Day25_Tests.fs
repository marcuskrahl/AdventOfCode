module Day25_Tests

open System
open Xunit
open Day25

let input = [
        "v...>>.vv>";
        ".vv>>.vv..";
        ">>.>v>...v";
        ">>v>>.>.v.";
        "v>v.vv.v..";
        ">.>>..v...";
        ".vv..>.>v.";
        "v.v..>>v.v";
        "....v..v.>"
    ]


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(58, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(42, result)

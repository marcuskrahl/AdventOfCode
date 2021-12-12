module Day12_Tests

open System
open Xunit
open Day12

let input = [
        "start-A";
        "start-b";
        "A-c";
        "A-b";
        "b-d";
        "A-end";
        "b-end"
    ]


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(10, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(36, result)

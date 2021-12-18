module Day15_Tests

open System
open Xunit
open Day15

let input = [
        "1163751742";
        "1381373672";
        "2136511328";
        "3694931569";
        "7463417111";
        "1319128137";
        "1359912421";
        "3125421639";
        "1293138521";
        "2311944581"
    ]


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(40, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(315, result)

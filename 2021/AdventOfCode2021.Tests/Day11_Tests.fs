module Day11_Tests

open System
open Xunit
open Day11

let input = [
        "5483143223";
        "2745854711";
        "5264556173";
        "6141336146";
        "6357385478";
        "4167524645";
        "2176841721";
        "6882881134";
        "4846848554";
        "5283751526"
    ]


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(1656, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(195, result)

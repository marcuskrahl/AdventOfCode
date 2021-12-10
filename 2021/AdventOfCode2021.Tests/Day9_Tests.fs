
module Day9_Tests

open System
open Xunit
open Day9


let input = [
        "2199943210";
        "3987894921";
        "9856789892";
        "8767896789";
        "9899965678"
    ]

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(15, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(1134, result)



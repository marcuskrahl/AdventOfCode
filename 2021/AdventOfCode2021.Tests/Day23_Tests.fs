module Day23_Tests

open System
open Xunit
open Day23

let input = [
    
    ]


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(12521, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(42, result)

module Day7_Tests

open System
open Xunit
open Day7


let input = [ "16,1,2,0,4,2,7,1,2,14" ]

[<Fact>]
let ``get correct fuel to position`` () =
    let positions = [ 1; 2; 3; 4; 10]
    let result = getFuelToPosition positions 3
    Assert.Equal(11, result)

[<Fact>]
let ``get correct fuel to position quad`` () =
    let positions = [ 1; 2; 3; 4; 10]
    let result = getFuelToPositionQuad positions 3
    Assert.Equal(33, result)

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(37, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(168, result)



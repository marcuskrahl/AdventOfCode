module Day17_Tests

open System
open Xunit
open Day17

let input = [
        "target area: x=20..30, y=-10..-5"
    ]

[<Fact>]
let ``parse area`` () =
    let result = input |> List.head |> parseInput
    Assert.Equal(((20,30), (-10,-5)), result)

[<Fact>]
let ``reaches area`` () =
    let area = (20,30),(-10,-5)
    Assert.Equal(true, reachesArea (0,0) (7,2) area)
    Assert.Equal(true, reachesArea (0,0) (6,3) area)
    Assert.Equal(true, reachesArea (0,0) (9,0) area)
    Assert.Equal(false, reachesArea (0,0) (17,-4) area)

[<Fact>]
let ``reaches area and velocity`` () =
    let area = (20,30),(-10,-5)
    Assert.Equal((true,45), reachesAreaAndVelocity (0,0) (6,9) area 0)

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(45, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(112, result)

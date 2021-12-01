module Day1_Tests

open System
open Xunit

[<Fact>]
let ``Day1 Part 1 returns correct result`` () =
    let example_input = [ "199"; "200"; "208"; "210"; "200"; "207"; "240"; "269"; "260"; "263" ]
    let result = Day1.part1 example_input
    Assert.Equal(result, 7)

[<Fact>]
let ``Day1 Part 2 returns correct result`` () =
    let example_input = [ "199"; "200"; "208"; "210"; "200"; "207"; "240"; "269"; "260"; "263" ]
    let result = Day1.part2 example_input
    Assert.Equal(result, 5)

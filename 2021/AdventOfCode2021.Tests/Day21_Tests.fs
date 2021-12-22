module Day21_Tests

open System
open Xunit
open Day21

let input = [
        "Player 1 starting position: 4";
        "Player 2 starting position: 8"
    ]

[<Fact>]
let ``get rolls`` () =
    Assert.Equal(([7;8;9],9), getRolls 6)
    Assert.Equal(([99;100;1],101), getRolls 98)

[<Fact>]
let ``get score`` () =
    Assert.Equal((2,6), scorePlayer 7 4 5)

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(739785, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(444356092776315L, result)

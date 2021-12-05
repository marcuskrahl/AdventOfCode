
module Day5_Tests

open System
open Xunit
open Day5


let input = [ 
        "0,9 -> 5,9";
        "8,0 -> 0,8";
        "9,4 -> 3,4";
        "2,2 -> 2,1";
        "7,0 -> 7,4";
        "6,4 -> 2,0";
        "0,9 -> 2,9";
        "3,4 -> 1,4";
        "0,0 -> 8,8";
        "5,5 -> 8,2"
    ]


[<Fact>]
let ``Day4 Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(result, 5)

[<Fact>]
let ``Day4 Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(result, 12)



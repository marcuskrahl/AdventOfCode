module Day24_Tests

open System
open Xunit
open Day24

let input = [

    ]

let testProgram input values expectedResult = 
    let instr = input |> List.map parseInstruction
    let result = runProgram instr values
    Assert.Equal<int[]>(expectedResult, result)

[<Fact>]
let ``simple program`` () = 
    let input = [
            "inp x";
            "mul x -1"
        ]
    testProgram input [2] [|0;-2;0;0|] 

[<Fact>]
let ``simple program 2`` () = 
    let input = [
            "inp z";
            "inp x";
            "mul z 3";
            "eql z x"
        ]
    testProgram input [1;3] [|0;3;0;1|] 
    testProgram input [2;3] [|0;3;0;0|] 
    testProgram input [0;3] [|0;3;0;0|] 


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(42, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(42, result)

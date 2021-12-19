module Day18_Tests

open System
open Xunit
open Day18

let input = [
        "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]";
        "[[[5,[2,8]],4],[5,[[9,9],0]]]";
        "[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]";
        "[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]";
        "[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]";
        "[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]";
        "[[[[5,4],[7,7]],8],[[8,3],8]]";
        "[[9,3],[[9,9],[6,[4,9]]]]";
        "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]";
        "[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]"
    ]

let testExplode input result = 
    let pair = input |> parsePair
    let (r,_) = explode pair
    let resultStr = r |> pairToString
    Assert.Equal(result, resultStr)

let testSplit input result = 
    let pair = input |> parsePair
    let (r,_) = split pair
    let resultStr = r |> pairToString
    Assert.Equal(result, resultStr)

let testReduce input result = 
    let pair = input |> parsePair
    let r = reducePair pair
    let resultStr = r |> pairToString
    Assert.Equal(result, resultStr)

[<Fact>]
let ``explodes correctly`` () =
    testExplode "[[[[[9,8],1],2],3],4]" "[[[[0,9],2],3],4]"
    testExplode "[7,[6,[5,[4,[3,2]]]]]" "[7,[6,[5,[7,0]]]]"
    testExplode "[[6,[5,[4,[3,2]]]],1]" "[[6,[5,[7,0]]],3]"
    testExplode "[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]" "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]"
    testExplode "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]" "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"

[<Fact>]
let ``splits correctly`` () =
    testSplit "[11,1]" "[[5,6],1]"

[<Fact>]
let ``reduces correctly`` () =
    testReduce "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]" "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(4140L, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(3993L, result)

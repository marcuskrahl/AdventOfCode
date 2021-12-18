module Day16_Tests

open System
open Xunit
open Day16

let input = [

    ]


[<Fact>]
let ``parses hex to binary`` () = 
    Assert.Equal<Collections.Generic.IEnumerable<int>>([1;1;0;1;0;0;1;0;1;1;1;1;1;1;1;0;0;0;1;0;1;0;0;0], parseHex "D2FE28")

[<Fact>]
let ``parses binary to decimal`` () = 
    Assert.Equal(5L, binToDec [1;0;1])

[<Fact>]
let ``parses literal`` () = 
    let (result, _) = parseLiteral [1;0;1;1;1;1;1;1;1;0;0;0;1;0;1;0;0;0]
    Assert.Equal(Literal 2021L, result) 

[<Fact>]
let ``Part 1 returns correct result`` () =
    Assert.Equal(6, part1 ["D2FE28"])
    Assert.Equal(16, part1 ["8A004A801A8002F478"])
    Assert.Equal(12, part1 ["620080001611562C8802118E34"])
    Assert.Equal(23, part1 ["C0015000016115A2E0802F182340"])
    Assert.Equal(31, part1 ["A0016C880162017C3686B18A3D4780"])

[<Fact>]
let ``Part 2 returns correct result`` () =
    Assert.Equal(3L, part2 ["C200B40A82"])
    Assert.Equal(54L, part2 ["04005AC33890"])
    Assert.Equal(7L, part2 ["880086C3E88112"])
    Assert.Equal(9L, part2 ["CE00C43D881120"])
    Assert.Equal(1L, part2 ["D8005AC2A8F0"])
    Assert.Equal(0L, part2 ["F600BC2D8F"])
    Assert.Equal(0L, part2 ["9C005AC2F8F0"])
    Assert.Equal(1L, part2 ["9C0141080250320F1802104A08"])

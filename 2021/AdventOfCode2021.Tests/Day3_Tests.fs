module Day3_Tests

open System
open Xunit
open Day3

[<Fact>]
let ``Convert to binary`` () =
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inputToBinary("1"), [One])
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inputToBinary("0"), [Zero])
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inputToBinary("10010"), [One; Zero; Zero; One; Zero])

[<Fact>]
let ``most significant`` () =
    Assert.Equal(mostSignificant([One]), One)
    Assert.Equal(mostSignificant([Zero]), Zero)
    Assert.Equal(mostSignificant([One;Zero]), One)
    Assert.Equal(mostSignificant([One;Zero;Zero]), Zero)

[<Fact>]
let ``binary to number`` () =
    Assert.Equal(binaryToNumber([One]), 1)
    Assert.Equal(binaryToNumber([Zero]), 0)
    Assert.Equal(binaryToNumber([One; Zero]), 2)
    Assert.Equal(binaryToNumber([One; Zero; One]), 5)

[<Fact>]
let ``inverse`` () =
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inverse([One]), [Zero])
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inverse([Zero]), [One])
    Assert.Equal<Collections.Generic.IEnumerable<Binary>>(inverse([One; Zero; One]), [Zero; One; Zero])

[<Fact>]
let ``Day3 Part 1 returns correct result`` () =
    let input = [ "00100";
        "11110";
        "10110";
        "10111";
        "10101";
        "01111";
        "00111";
        "11100";
        "10000";
        "11001";
        "00010";
        "01010"]
    let result = part1 input
    Assert.Equal(result, 198)

[<Fact>]
let ``Day3 Part 2 returns correct result`` () =
    let input = [ "00100";
        "11110";
        "10110";
        "10111";
        "10101";
        "01111";
        "00111";
        "11100";
        "10000";
        "11001";
        "00010";
        "01010"]
    let result = part2 input
    Assert.Equal(result, 230)



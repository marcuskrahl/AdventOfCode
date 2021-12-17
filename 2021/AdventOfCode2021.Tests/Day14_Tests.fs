module Day14_Tests

open System
open Xunit
open Day14

let input = [
        "NNCB";
        "";
        "CH -> B";
        "HH -> N";
        "CB -> H";
        "NH -> C";
        "HB -> C";
        "HC -> B";
        "HN -> C";
        "NN -> C";
        "BH -> H";
        "NC -> B";
        "NB -> B";
        "BN -> B";
        "BB -> N";
        "BC -> B";
        "CC -> N";
        "CN -> C"
    ]

[<Fact>]
let ``parses rule`` () =
    let result = parseRule "AB -> C"
    Assert.Equal((('A', 'B'), 'C'), result)

[<Fact>]
let ``applies rules`` () =
    let rules = Map [ (('N', 'N'),  'C');  (('N', 'C'), 'B'); (('C', 'B'), 'H') ]
    let result = applyRules rules (Map [ (('N', 'N'), 1L); (('N', 'C') ,1L); (('C','B'), 1L)])
    let expected = Map [ (('N', 'C'),1L); (('C', 'N'), 1L); (('N','B'),1L); (('B','C'), 1L); (('C', 'H'), 1L); (('H', 'B'), 1L) ]
    Assert.Equal<Map<(char * char), int64>>(expected, result)


[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(1588L, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(2188189693529L, result)

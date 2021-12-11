module Day10_Tests

open System
open Xunit
open Day10


let input = [
        "[({(<(())[]>[[{[]{<()<>>";
        "[(()[<>])]({[<{<<[]>>(";
        "{([(<{}[<>[]}>{[]{[(<()>";
        "(((({<>}<{<{<>}{[]{[]{}";
        "[[<[([]))<([[{}[[()]]]";
        "[{[{({}]{}}([{[{{{}}([]";
        "{<[[]]>}<{[{[{[]{()[[[]";
        "[<(<(<(<{}))><([]([]()";
        "<{([([[(<>()){}]>(<<{{";
        "<{([{{}}[<[[[<>{}]]]>[]]"
    ]

[<Fact>]
let ``Parse line is correct`` () =
    let result = parseLine "({]>";
    Assert.Equal<Collections.Generic.IEnumerable<Symbol>>([RoundOpen; CurlyOpen; SquareClose; ArrowClose], result)


[<Fact>]
let ``Check input correctly`` () =
    Assert.Equal(None, checkLine [ RoundOpen; RoundClose])
    Assert.Equal(None, checkLine [ RoundOpen])
    Assert.Equal(None, checkLine [ RoundOpen; CurlyOpen; CurlyClose; RoundClose])
    Assert.Equal(None, checkLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowOpen; SquareOpen; SquareClose; ArrowClose; RoundClose])
    Assert.Equal(Some (RoundClose, ArrowClose), checkLine [ RoundOpen; ArrowClose])
    Assert.Equal(Some (RoundClose, ArrowClose), checkLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowClose])
    Assert.Equal(Some (SquareClose, ArrowClose), checkLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowOpen; SquareOpen; ArrowClose; RoundClose])

[<Fact>]
let ``autocomplete correctly`` () =
    Assert.Equal(None, autoCompleteLine [ RoundOpen; RoundClose])
    Assert.Equal(Some [RoundClose],  autoCompleteLine [ RoundOpen])
    Assert.Equal(Some [CurlyClose; RoundClose], autoCompleteLine [ RoundOpen; CurlyOpen ])
    Assert.Equal(Some [ArrowClose; RoundClose],  autoCompleteLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowOpen; SquareOpen; SquareClose])
    Assert.Equal(None, autoCompleteLine [ RoundOpen; ArrowClose])
    Assert.Equal(None, autoCompleteLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowClose])
    Assert.Equal(None, autoCompleteLine [ RoundOpen; CurlyOpen; CurlyClose; ArrowOpen; SquareOpen; ArrowClose; RoundClose])

[<Fact>]
let ``autocomplete score correctly`` () =
    Assert.Equal(294L, scoreAutocomplete [SquareClose; RoundClose; CurlyClose; ArrowClose])

[<Fact>]
let ``Part 1 returns correct result`` () =
    let result = part1 input
    Assert.Equal(26397, result)

[<Fact>]
let ``Part 2 returns correct result`` () =
    let result = part2 input
    Assert.Equal(288957L, result)



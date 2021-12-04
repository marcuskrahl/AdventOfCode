module Day2_Tests

open System
open Xunit

[<Fact>]
let ``correctly parse input`` () =
    Assert.Equal(Day2.parseInput "forward 5", Day2.Forward(5))
    Assert.Equal(Day2.parseInput "up 15", Day2.Up(15))
    Assert.Equal(Day2.parseInput "down 16", Day2.Down(16))

[<Fact>]
let ``correctly move`` () =
    Assert.Equal(Day2.move (Day2.Forward(5), (0,0)) , (5, 0))
    Assert.Equal(Day2.move (Day2.Down(7), (0,0)), (0, 7))
    Assert.Equal(Day2.move (Day2.Up(3), (0,10)), (0, 7))

[<Fact>]
let ``correctly aim and move`` () =
    Assert.Equal(Day2.aimAndMove (Day2.Forward(5), (0,0,0)) , (5, 0, 0))
    Assert.Equal(Day2.aimAndMove (Day2.Down(7), (0,0,0)), (0,0,7))
    Assert.Equal(Day2.aimAndMove (Day2.Up(3), (0,0,10)), (0,0,7))
    Assert.Equal(Day2.aimAndMove (Day2.Forward(5), (0,0,2)) , (5, 10, 2))


[<Fact>]
let ``Day2 Part 1 returns correct result`` () =
    let input = [ "forward 5"; "down 5"; "forward 8"; "up 3"; "down 8"; "forward 2" ]
    let result = Day2.part1 input
    Assert.Equal(result, 150)

[<Fact>]
let ``Day2 Part 2 returns correct result`` () =
    let input = [ "forward 5"; "down 5"; "forward 8"; "up 3"; "down 8"; "forward 2" ]
    let result = Day2.part2 input
    Assert.Equal(result, 900)


module Day25

open System

type Cell = 
    | Right
    | Down
    | Empty

let parseChar input = 
    match input with
        | '>' -> Right
        | 'v' -> Down
        | '.' -> Empty

let parseInput (input: string list) = 
    Array2D.init ( input |> List.head).Length (input |> List.length) (fun i j -> parseChar (input |> List.item j).[i])

let getRightMovements arr =
    let length1 = arr |> Array2D.length1
    let length2 = arr |> Array2D.length2
    seq {
        for j in 0..(length2 - 1) do
            for i in 0..(length1 - 1) do
                if arr.[i,j] = Right 
                then
                    let inew = (i + 1) % length1
                    if arr.[inew,j] = Empty 
                    then yield ((i,j),(inew,j))
                    else ()
                else ()
    }

let getDownMovements arr =
    let length1 = arr |> Array2D.length1
    let length2 = arr |> Array2D.length2
    seq {
        for j in 0..(length2 - 1) do
            for i in 0..(length1 - 1) do
                if arr.[i,j] = Down 
                then
                    let jn = (j + 1) % length2
                    if arr.[i,jn] = Empty 
                    then yield ((i,j),(i,jn))
                    else ()
                else ()
    }

let rec simulate arr run = 
    let mutable didMove = false
    let movements = getRightMovements arr |> List.ofSeq 
    didMove <- didMove || ((movements |> List.length) > 0) 
    for ((i,j),(i2,j2)) in movements do 
        arr.[i,j] <- Empty
        arr.[i2,j2] <- Right
    let movements = getDownMovements arr |> List.ofSeq 
    didMove <- didMove || ((movements |> List.length) > 0) 
    for ((i,j),(i2,j2)) in movements do 
        arr.[i,j] <- Empty
        arr.[i2,j2] <- Down
    if didMove
    then simulate arr (run + 1)
    else run

let part1 (input: string list) = 
    let grid = parseInput input
    simulate grid 1

let part2 (input: string list) = 
    42

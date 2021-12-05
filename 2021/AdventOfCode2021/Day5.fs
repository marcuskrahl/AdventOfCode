module Day5

open System

type Grid = int list list


type Movement = (int * int) * (int * int)

let parseInput (input: string) : Movement = 
    let from :: toStr :: _ = input.Split(" -> ") |> List.ofSeq
    let x1 :: y1 :: _ = from.Split(",") |> List.ofSeq |> List.map Convert.ToInt32
    let x2 :: y2 :: _ = toStr.Split(",") |> List.ofSeq |> List.map Convert.ToInt32 
    ((x1,y1), (x2,y2))


let matchesMovement (x,y) movement =
    let (x1,y1),(x2, y2) = movement
    if x1 <> x2 && y1 <> y2 then
        false
    else 
        ((x >= x1 && x <= x2) || (x >= x2 && x <= x1)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))  

let sign x = 
    if x < 0 then -1 else if x > 0 then 1 else 0

let matchesMovementDiag (x,y) movement = 
    let (x1,y1),(x2, y2) = movement
    if x1 = x2 || y1 = y2 then
        false
    else 

        if ((x >= x1 && x <= x2) || (x >= x2 && x <= x1)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))  then
            let diffX = x1 - x2
            let diffY = y1 - y2
            let progressX = x - x1
            let progressY = y - y1 
            if sign diffX = sign diffY then
                progressX = progressY
            else
                progressX = -progressY

        else
        false

let fillGrid (grid:Grid) (movement:Movement) = 
        grid |> List.mapi (fun x row -> row |> List.mapi (fun y v -> if matchesMovement (x,y) movement  then v + 1 else v))

let fillGridDiag (grid:Grid) (movement:Movement) = 
        grid |> List.mapi (fun x row -> row |> List.mapi (fun y v -> if matchesMovement (x,y) movement || matchesMovementDiag (x,y) movement  then v + 1 else v))


let printGrid grid = 
    grid |> List.transpose |> List.map (fun row -> row |> List.map (fun v -> printf "%d" v) ; printfn "")

let countOverlaps grid = 
    grid |> List.map (fun row -> row |> List.map (fun v -> if v >= 2 then 1 else 0) |> List.sum) |> List.sum


let rec generatePoints movement = 
    let ((x1, y1), (x2,y2)) = movement
    if x1 = x2 && y1 = y2 
    then 
        [ (x1, y1) ]
    else
        let xDiff = sign (x2 - x1)
        let yDiff = sign (y2 - y1)
        (x1, y1) :: generatePoints ((x1 + xDiff, y1 + yDiff), (x2, y2))

let part1 (input: string list) = 
    let movements = input |> List.map parseInput
    let grid = List.init 1000 (fun _ -> List.init 1000 (fun _ -> 0))
    let filledGrid = movements |> List.fold (fun acc m -> fillGrid acc m) grid
    //let reducedGrid = filledGrid |> List.take 10 |> List.map (fun l -> l |> List.take 10)
    countOverlaps filledGrid


let part2_slow (input: string list) = 
    let movements = input |> List.map parseInput
    let grid = List.init 1000 (fun _ -> List.init 1000 (fun _ -> 0))
    let filledGrid = movements |> List.fold (fun acc m -> printfn "%A" m; fillGridDiag acc m) grid
    //let reducedGrid = filledGrid |> List.take 10 |> List.map (fun l -> l |> List.take 10)
    countOverlaps filledGrid

let part2 (input: string list) = 
    let movements = input |> List.map parseInput
    let points = movements |> List.map generatePoints |> List.concat
    let groupedPoints = points |> List.countBy (fun m -> m)
    let result = groupedPoints |> List.map (fun (_, c) -> if c >= 2 then 1 else 0) |> List.sum
    result

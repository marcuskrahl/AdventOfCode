module Day11

open System

let parseCave (input: string list) =
    let inputLength = input |> List.length
    let heightMap = Array2D.create inputLength (input |> List.item 0).Length 0
    input |> List.iteri (fun i line -> 
        for j in 0..(line.Length - 1) do
            heightMap.[i,j] <- Convert.ToInt32($"{line.[j]}")
    )
    heightMap


let flashPos (cave: int[,]) i j =
    cave.[i,j] <- 0
    for iDelta in -1..1 do
        for jDelta in -1..1 do
            let newI = i + iDelta
            let newJ = j + jDelta
            if iDelta = 0 && jDelta = 0 then ()
            else if newI < 0 || newJ < 0 then ()
            else if newI >= Array2D.length1 cave || newJ >= Array2D.length2 cave then ()
            else if cave.[newI, newJ] = 0 then ()
            else 
                cave.[newI,newJ] <- cave.[newI, newJ] + 1
                ()

let rec flashCave cave = 
    let mutable flashes = 0;
    for i in 0..((cave |> Array2D.length1) - 1) do
        for j in 0..((cave |> Array2D.length2) - 1) do
            if cave.[i,j] > 9 then
                flashes <- flashes + 1
                flashPos cave i j
            else ()
    if flashes > 0 then
        flashes + flashCave cave
    else
        flashes

let printCave cave = 
    Console.SetCursorPosition(0,0)
    for i in 0..((cave |> Array2D.length1) - 1) do
        for j in 0..((cave |> Array2D.length2) - 1) do
            Console.Write($"{cave.[i,j]}")
        Console.WriteLine()
    System.Threading.Thread.Sleep(300)

let rec simulateCaveStep cave remainingSteps flashes =
    if remainingSteps = 0 then
        flashes
    else
    let increasedCave = Array2D.map (fun c -> c + 1) cave 
    let newFlashes = flashCave increasedCave 
    //printCave increasedCave
    simulateCaveStep increasedCave (remainingSteps - 1) (flashes + newFlashes)

let rec getAllFlash cave steps =
    let increasedCave = Array2D.map (fun c -> c + 1) cave 
    let newFlashes = flashCave increasedCave 
    if newFlashes = (Array2D.length1 cave) * (Array2D.length2 cave) then
        steps + 1
    else
       getAllFlash increasedCave (steps + 1)

let part1 (input: string list) = 
    let cave = parseCave input
    let result = simulateCaveStep cave 100 0
    result

let part2 (input: string list) = 
    let cave = parseCave input
    let result = getAllFlash cave 0
    result

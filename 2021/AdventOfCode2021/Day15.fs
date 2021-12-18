module Day15

open System

let parseInput (input: string list) =  
    let length = input |> List.length
    let grid = Array2D.init length length (fun i j -> Convert.ToInt32($"{(input |> List.item i).[j]}"))
    grid

let markNeighbors grid (i,j) visited cost = 
    if i < 0 || j < 0 then ()
    else if i >= (grid |> Array2D.length1) || j >= (grid |> Array2D.length2) then ()
    else
        let (oldPos,oldValue) = grid.[i,j]
        if oldPos > 9 then ()
        else 
        if oldValue > cost then
            grid.[i,j] <- (oldPos,cost)
        else ()

let getNextNode grid (visited : ( int * int) list) = 
    let mutable minValue = 999999999 
    let mutable minNode = (0,0)
    for i in 0..((grid |> Array2D.length1) - 1) do
        for j in 0..((grid |> Array2D.length2) - 1) do
            let (cost,value) = grid.[i,j]
            if cost > 9 then ()
            else
            if value < minValue then
                minValue <- value
                minNode <- (i,j)
            else ()
    minNode


let getShortestPath grid = 
    let gridDistance = grid |> Array2D.map (fun n -> (n, 999999999))
    let (v, _) = gridDistance.[0,0]
    gridDistance.[0,0] <- (v, 0)
    let rec getShortestPathRec (visited: (int * int) list) (pos : (int * int)) = 
        //printfn "%A" visited
        //printfn "%A" gridDistance
        let (i,j) = pos
        let (cost, value) = gridDistance.[i,j]
        printfn "%d %d %d" value i j  
        if i = (grid |> Array2D.length1) - 1 && j = (grid |> Array2D.length2) - 1 then cost + value
        else
            markNeighbors gridDistance ((i - 1), j) visited (cost + value)
            markNeighbors gridDistance ((i + 1), j) visited (cost + value)
            markNeighbors gridDistance (i, (j - 1)) visited (cost + value)
            markNeighbors gridDistance (i, (j + 1)) visited (cost + value)
            gridDistance.[i,j] <- (9999, value)
            let newVisited = visited
            let nextNode = getNextNode gridDistance newVisited
            getShortestPathRec newVisited nextNode 
    (getShortestPathRec [] (0,0)) - grid.[0,0]

let enlargeGrid tile =
    let tileLength = tile |> Array2D.length1
    let gridLength = tileLength * 5
    Array2D.init gridLength gridLength (fun i j -> 
            let iInTile = i % tileLength
            let jInTile = j % tileLength
            let increase  = (i / tileLength) + (j / tileLength)
            let value = tile.[iInTile, jInTile] + increase
            if value > 9 then (value % 9) else value
        )

let printGrid grid = 
    let maxIndex = (grid |> Array2D.length1) - 1
    for i in 0..maxIndex do
        for j in 0..maxIndex do
            printf "%d" grid.[i,j]
        printfn ""

let part1 (input: string list) = 
    let grid = parseInput input
    let path = getShortestPath grid
    path

let part2 (input: string list) = 
    let grid = parseInput input |> enlargeGrid 
    //printGrid grid
    grid |> getShortestPath

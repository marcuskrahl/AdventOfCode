module Day13

open System

type Fold = 
    | X of int
    | Y of int 

let parseInput (input: string list)  =
    let rec parsePoints remainingInput points =
        match remainingInput with
            | "" :: rest -> (points |> List.rev, rest)
            | pString :: rest ->
                let [x;y] = pString.Split(",") |> List.ofSeq |> List.map (fun n -> Convert.ToInt32(n))
                parsePoints rest ((x,y) :: points) 
    let rec parseFolds (remainingInput: string list) folds = 
        match remainingInput with
            | [] -> folds |> List.rev
            | foldString :: rest -> 
                let [instruction; valueString] = foldString.Split("=") |> List.ofSeq
                let v = Convert.ToInt32 valueString
                let fold = if instruction.EndsWith("y") then Y v else X v
                parseFolds rest (fold::folds)
    let (points, rest) = parsePoints input []
    let folds = parseFolds rest []
    (points, folds)



let printPoints points = 
    let (maxX,_) = points |> List.maxBy (fun (x,_) -> x)
    let (_,maxY) = points |> List.maxBy (fun (_,y) -> y)
    for y in 0..maxY do
        for x in 0..maxX do
            let v = if points |> List.contains (x,y) then '#' else '.'
            printf "%c" v 
        printfn("")

let doFold points fold =
    points |> List.map (fun (x,y) -> 
        match fold with
            | X(col) -> if x <= col then (x,y) else (col - (x - col),y)
            | Y(row) -> if y <= row then (x,y) else (x, row - (y - row)) 
    ) |> List.distinct


let part1 (input: string list) = 
    let (points, folds) = parseInput input
    let foldResult = doFold points (folds |> List.head)
    //printPoints foldResult
    foldResult |> List.length

let part2 (input: string list) = 
    let (points, folds) = parseInput input
    let foldResult = folds |> List.fold (fun pts fold -> doFold pts fold) points
    printPoints foldResult
    42

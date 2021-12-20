module Day20

open System


let parseAlgorithm (input: string) = 
    Array.init input.Length (fun i -> if input.[i]  = '#' then 1 else 0)

let parseMap (input: string list) = 
    (seq {
        for y in 0..((input |> List.length) - 1) do
            let line = input |> List.item y
            for x in 0..(line.Length - 1) do 
                if line.[x] = '#' then yield (x,y) else ()
    }) |> List.ofSeq

let advance (algorithm : int[]) litPlaces voidIsLit = 
    let (xMin,_) = litPlaces |> List.minBy (fun (x,_) -> x)
    let (xMax,_) = litPlaces |> List.maxBy (fun (x,_) -> x)
    let (_,yMin) = litPlaces |> List.minBy (fun (_,y) -> y)
    let (_,yMax) = litPlaces |> List.maxBy (fun (_,y) -> y)
    let litPlacesArr = Array2D.create (xMax - xMin + 1) (yMax - yMin + 1) 0 
    litPlaces |> List.iter (fun (x,y) -> litPlacesArr.[x - xMin, y - yMin] <- 1)

    (seq {
        for x0 in (xMin - 2)..(xMax + 2) do
            for y0 in (yMin - 2)..(yMax + 2) do
                let mutable algoIndex : int = 0
                for dy in -1..1 do
                    for dx in -1..1 do
                        let x = x0 + dx
                        let y = y0 + dy
                        let isLit: int = 
                            if x < xMin || x > xMax || y < yMin || y > yMax 
                            then voidIsLit
                            else litPlacesArr.[x - xMin,y - yMin]
                        algoIndex <- (algoIndex * 2) + isLit
                if algorithm.[algoIndex] = 1 then yield (x0, y0) else ()
    }) |> List.ofSeq

let printMap litPlaces = 
    let (xMin,_) = litPlaces |> List.minBy (fun (x,_) -> x)
    let (xMax,_) = litPlaces |> List.maxBy (fun (x,_) -> x)
    let (_,yMin) = litPlaces |> List.minBy (fun (_,y) -> y)
    let (_,yMax) = litPlaces |> List.maxBy (fun (_,y) -> y)
    for y in yMin..yMax do
        for x in xMin..xMax do
            let c = 
                if litPlaces |> List.contains (x,y) 
                then '#' 
                else '.'
            printf "%c" c
        printfn ""
    printfn ""
    printfn ""

let part1 (input: string list) = 
    let algorithm = input |> List.head |> parseAlgorithm 
    let litPlaces = input |> List.skip 2 |> parseMap
    printMap litPlaces
    let step1 = advance algorithm litPlaces 0
    printfn "Done step 1"
    printMap step1
    let step2 = advance algorithm step1 algorithm.[0]
    printMap step2
    step2 |> List.length

let part2 (input: string list) = 
    let algorithm = input |> List.head |> parseAlgorithm 
    let mutable litPlaces = input |> List.skip 2 |> parseMap
    printMap litPlaces
    for i in 1..25 do 
        let step1 = advance algorithm litPlaces 0
        //printMap step1
        let step2 = advance algorithm step1 algorithm.[0]
        //printMap step2
        litPlaces <- step2
        printfn "%d" i
    litPlaces |> List.length

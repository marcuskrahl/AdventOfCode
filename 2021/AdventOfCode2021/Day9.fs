module Day9

open System



let parseHeightMap (input: string list) =
    let inputLength = input |> List.length
    let heightMap = Array2D.create inputLength (input |> List.item 0).Length 0
    input |> List.iteri (fun i line -> 
        for j in 0..(line.Length - 1) do
            heightMap.[i,j] <- Convert.ToInt32($"{line.[j]}")
    )
    heightMap

let getSurroundingPoints heightMap i j = 
    seq {
        for iDelta in -1..1 do
            for jDelta in -1..1 do 
                if (iDelta <> 0 || jDelta <> 0) && (iDelta = 0 || jDelta = 0) then
                    let iTarget = i + iDelta
                    let jTarget = j + jDelta
                    if iTarget < 0 || jTarget < 0 then
                        ()
                    else if iTarget >= (heightMap |> Array2D.length1) || jTarget >= (heightMap |> Array2D.length2) then
                        ()
                    else
                        yield heightMap.[iTarget,jTarget] 

                else
                    ()
    }

let getLowPoints heightMap = 
    seq {
        let lenI = heightMap |> Array2D.length1
        let lenJ = heightMap |> Array2D.length2
        for i in 0..(lenI-1) do
            for j in 0..(lenJ-1) do
                let v = heightMap.[i,j]
                let surroundingPoints = getSurroundingPoints heightMap i j 
                let isLowestPoint = surroundingPoints|> List.ofSeq |> List.forall (fun v2 -> v2 > v)
                if isLowestPoint then
                    yield (i,j,v)
                else
                    ()
    }

let getBasinSize heightMap i j = 
    let rec floodFill iF jF = 
        if iF < 0 || jF < 0 then
            0
        else if iF >= Array2D.length1 heightMap || jF >= Array2D.length2 heightMap then
            0
        else 
        let v = heightMap.[iF,jF]
        if v < 0 || v >= 9 then
            0
        else
            heightMap.[iF,jF] <- -1
            1 + floodFill (iF - 1) jF + floodFill (iF + 1) jF + floodFill iF (jF - 1) + floodFill iF (jF + 1)
    floodFill i j 

let part1 (input: string list) = 
    let heightMap = parseHeightMap input
    let lowPoints = getLowPoints heightMap |> List.ofSeq
    let result = lowPoints |> List.map (fun (i,j,v) -> v + 1) |> List.sum
    result

let part2 (input: string list) = 
    let heightMap = parseHeightMap input
    let lowPoints = getLowPoints heightMap |> List.ofSeq
    let result = lowPoints |> List.map (fun (i,j,_) -> getBasinSize heightMap i j) |> List.sort |> List.rev
    let v1 :: v2 :: v3 :: _ = result
    v1 * v2 * v3

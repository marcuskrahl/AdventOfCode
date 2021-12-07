module Day7

open System



let getFuelToPosition (positions: int list) (target: int) =
    positions |> List.map (fun p -> Math.Abs(target - p)) |> List.sum

let quadSteps (target:int) (p:int) = 
    let steps = Math.Abs(target - p);
    steps * (steps + 1) / 2

let getFuelToPositionQuad (positions: int list) (target: int) =
    positions |> List.map (quadSteps target) |> List.sum

let getOptimalPosition fuelFunction positions =
    let rec getPositionRec current max (minFuel, min) = 
        if current > max 
        then (minFuel, min) 
        else 
            let fuel = fuelFunction positions current
            let nextMin = if fuel < minFuel then (fuel, current) else (minFuel, min)
            getPositionRec (current + 1) max nextMin

    let minPos = positions |> List.min
    let maxPos = positions |> List.max
    let initialFuel = fuelFunction positions minPos
    getPositionRec (minPos + 1) maxPos (initialFuel, minPos)



let part1 (input: string list) = 
    let positions = input |> List.head |> (fun s -> s.Split(",")) |> List.ofSeq |> List.map Convert.ToInt32
    let (fuel, position) = getOptimalPosition getFuelToPosition positions
    printfn "%d %d" fuel position
    fuel

let part2 (input: string list) = 
    let positions = input |> List.head |> (fun s -> s.Split(",")) |> List.ofSeq |> List.map Convert.ToInt32
    let (fuel, position) = getOptimalPosition getFuelToPositionQuad positions
    printfn "%d %d" fuel position
    fuel

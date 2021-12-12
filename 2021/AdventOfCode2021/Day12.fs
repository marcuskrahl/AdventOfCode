module Day12

open System

let parseMaze (input: string list): (string * string) list = 
    input |> List.map (fun i -> 
            let [source; target] = List.ofSeq (i.Split("-"))
            [(source, target); (target, source)]
        ) |> List.concat

let enumeratePaths (paths: (string * string) list) =
    let rec enumeratePathsRec currentPath visitedNodes currentNode =
        seq {
            if currentNode = "end" then
                yield (currentPath |> List.rev)
            else
                if visitedNodes |> List.contains currentNode then ()
                else
                let newVisitedNodes = if Char.IsLower(currentNode.[0]) then currentNode :: visitedNodes else visitedNodes
                let possiblePaths = paths |> List.filter (fun (source, target) -> source = currentNode)
                for (_, target) in possiblePaths do
                    yield! enumeratePathsRec (target :: currentPath) newVisitedNodes target
        }
    enumeratePathsRec ["start"] [] "start"

let enumeratePaths2 (paths: (string * string) list) =
    let rec enumeratePathsRec currentPath visitedNodes currentNode visitedTwice =
        seq {
            if currentNode = "end" then
                yield (currentPath |> List.rev)
            else
                if (visitedNodes |> List.contains currentNode) && ( visitedTwice = true || currentNode = "start") then ()
                else
                let newVisitedNodes = if Char.IsLower(currentNode.[0]) then currentNode :: visitedNodes else visitedNodes
                let possiblePaths = paths |> List.filter (fun (source, target) -> source = currentNode)
                let newVisitedTwice = visitedTwice || (visitedNodes |> List.contains currentNode)
                for (_, target) in possiblePaths do
                    yield! enumeratePathsRec (target :: currentPath) newVisitedNodes target newVisitedTwice
        }
    enumeratePathsRec ["start"] [] "start" false

let part1 (input: string list) = 
    let ways = input |> parseMaze
    let paths = enumeratePaths ways |> List.ofSeq
    printfn "%A" paths
    paths |> List.length

let part2 (input: string list) = 
    let ways = input |> parseMaze
    let paths = enumeratePaths2 ways |> List.ofSeq |> List.distinct |> List.sort
    printfn "%A" paths
    paths |> List.length 

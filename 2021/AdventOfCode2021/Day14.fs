module Day14

open System
open FSharp.Collections

let parseRule (ruleString: string) = 
    let [ tupleString; resultString] = ruleString.Split(" -> ") |> List.ofSeq
    (( tupleString.[0], tupleString.[1]),(resultString.[0]))

let applyRulesForTuple rules tuple =
    let rule = rules |> Map.tryFind tuple
    let (c1,c2) = tuple
    match rule with
        | Some output -> [output; c2] 
        | None -> [ c2; ]

let incMap map key value = 
    let existingValue = if Map.containsKey key map then Map.find key map else 0L
    Map.add key (value + existingValue) map

let applyRules rules input = 
    let keys = input |> Map.toSeq |> Seq.map fst
    let mutable result = Map []
    for key in keys do 
        let value = input |> Map.find key
        let rule = rules |> Map.tryFind key 
        match rule with 
            | Some output -> 
                let (r1, r2) = key
                result <- incMap result (r1, output) value 
                result <- incMap result (output, r2) value 
            | None ->
                result <- incMap result key value
    result

let countValues result = 
    // |> List.concat |> List.groupBy (fun (c, sum) -> c) |> List.map (fun (c, sums) -> (c,sums |> List.map (fun (_,s) -> s) |> List.sum))
    result 
        |> Map.toList 
        |> List.map (fun ((c1,c2), sum) -> [ (c1, sum); (c2, sum)]) 
        |> List.transpose 
        |> List.map (fun posList -> posList |> List.groupBy (fun (c, _) -> c) |> List.map (fun (c, rest) -> (c, rest |> List.map (fun (_,s) -> s) |> List.sum ))) 
        |> List.concat
        |> List.groupBy (fun (c,_) -> c) 
        |> List.map (fun (c, sums) -> (c, sums |> List.map (fun (_, s) -> s) |> List.max))

let part1 (input: string list) = 
    let first = (input |> List.head).ToCharArray() |> List.ofSeq |> List.pairwise |> List.map (fun t -> (t, 1L)) |> Map.ofList
    let rules = input |> List.skip 2 |> List.map parseRule |> Map.ofList
    let mutable result = first
    printfn "%A" (countValues result)
    for i in 1..10 do
        result <- applyRules rules result
        printfn "%A" (countValues result)
    let groups = countValues result
    let (_,max) = groups |> List.maxBy (fun (_,v) -> v)
    let (_,min) = groups |> List.minBy (fun (_,v) -> v)
    max - min

let part2 (input: string list) = 
    let first = (input |> List.head).ToCharArray() |> List.ofSeq |> List.pairwise |> List.map (fun t -> (t, 1L)) |> Map.ofList
    let rules = input |> List.skip 2 |> List.map parseRule |> Map.ofList
    let mutable result = first
    printfn "%A" (countValues result)
    for i in 1..40 do
        result <- applyRules rules result
        printfn "%A" (countValues result)
    let groups = countValues result
    let (_,max) = groups |> List.maxBy (fun (_,v) -> v)
    let (_,min) = groups |> List.minBy (fun (_,v) -> v)
    max - min

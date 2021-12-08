
module Day8

open System

type Mapping = Map<string, string>



let signalToDigit (signal: string list) = 
    let sortedSignal = signal |> List.sort
    match sortedSignal with 
        | ["a"; "b"; "c"; "e"; "f"; "g" ] -> Some(0)
        | ["c"; "f"] -> Some(1)
        | ["a"; "c"; "d"; "e"; "g"] -> Some(2)
        | ["a"; "c"; "d"; "f"; "g"] -> Some(3)
        | ["b"; "c"; "d"; "f"] -> Some(4)
        | ["a"; "b"; "d"; "f"; "g"] -> Some(5)
        | ["a"; "b"; "d"; "e"; "f"; "g"] -> Some(6)
        | ["a"; "c"; "f"] -> Some(7)
        | ["a"; "b"; "c"; "d"; "e"; "f"; "g" ] -> Some(8)
        | ["a"; "b"; "c"; "d"; "f"; "g" ] -> Some(9)
        | _ -> None


let applyMapping (mapping: Mapping) (signal: string list): string list  = 
    signal |> List.map (fun l -> mapping |> Map.find l)


let isCorrectMapping (signals: string list list) (mapping: Mapping) =
    //printfn "%A" mapping
    signals |> List.forall (fun s -> s |> applyMapping mapping  |> signalToDigit |> Option.isSome)

let getAllMappings = 
    let letters = ["a"; "b"; "c"; "d"; "e"; "f"; "g"]
    seq {
        for a in letters  do
            for b in letters do
                if b <> a 
                then
                    for c in letters do
                        if c <> a && c <> b 
                        then
                           for d in letters do
                           if d <> a && d <> b && d <> c
                           then
                              for e in letters do
                              if e <> a && e <> b && e <> c && e <> d
                              then
                                for f in letters do
                                if f <> a && f <> b && f <> c && f <> d && f <> e
                                then
                                    for g in letters  do
                                    if g <> a && g <> b && g <> c && g <> d && g <>e && g <> f 
                                    then
                                        let map = Map [
                                            (a, "a");
                                            (b, "b");
                                            (c, "c");
                                            (d, "d");
                                            (e, "e");
                                            (f, "f");
                                            (g, "g")
                                        ]
                                        yield map
                                    else
                                      ()
                                else
                                    ()
                              else 
                                ()
                           else
                            ()
                        else
                            ()

                else 
                    ()
    }

let getCorrectMapping (signals: string list list) = 
    let allMappings = getAllMappings
    allMappings |> Seq.find (isCorrectMapping signals) 

let decodePart (mapping: Mapping) (input: string) : int = 
    input.ToCharArray() |> List.ofSeq |> List.map (fun c -> $"{c}")  |> applyMapping mapping |> signalToDigit |> Option.get

let decodeString (mapping: Mapping) (input: string) : int = 
    let [v1; v2; v3; v4] = input.Split(" ") |> List.ofSeq |> List.map (decodePart mapping)
    v1 * 1000 + v2 * 100 + v3 * 10 + v4

let solveLine (line: string) =
    let [left; right] = line.Split(" | ") |> List.ofSeq;
    let signals = left.Split(" ") |> List.ofSeq |> List.map (fun l -> l.ToCharArray() |> List.ofSeq |> List.map (fun c -> $"{c}"))
    let correctMapping = getCorrectMapping signals
    decodeString correctMapping right

let getPart1Count (input: string) = 
    let reading = input.Split(" | ").[1]
    let values = reading.Split(" ") |> List.ofSeq
    values |> List.map (fun s -> s.Length) |> List.map (fun l -> match l with
        | 2 -> 1
        | 3 -> 1
        | 4 -> 1
        | 7 -> 1
        | _ -> 0
        ) |> List.sum

let part1 (input: string list) = 
    input |> List.map getPart1Count |> List.sum

let part2 (input: string list) = 
    input |> List.map solveLine |> List.sum 

module Day6

open System

type Population = {
    gen0: int64;
    gen1: int64;
    gen2: int64;
    gen3: int64;
    gen4: int64;
    gen5: int64;
    gen6: int64;
    gen7: int64;
    gen8: int64
}

let parsePopulation (input: string) : Population = 
    let values = input.Split(",") |> List.ofSeq 
    {
        gen0 = int64 (values |> List.filter (fun x -> x = "0") |> List.length);
        gen1 = int64 (values |> List.filter (fun x -> x = "1") |> List.length);
        gen2 = int64 (values |> List.filter (fun x -> x = "2") |> List.length);
        gen3 = int64 (values |> List.filter (fun x -> x = "3") |> List.length);
        gen4 = int64 (values |> List.filter (fun x -> x = "4") |> List.length);
        gen5 = int64 (values |> List.filter (fun x -> x = "5") |> List.length);
        gen6 = int64 (values |> List.filter (fun x -> x = "6") |> List.length);
        gen7 = int64 (values |> List.filter (fun x -> x = "7") |> List.length);
        gen8 = int64 (values |> List.filter (fun x -> x = "8") |> List.length);
    }

let step initialPopulation =
    {
        gen0 = initialPopulation.gen1;
        gen1 = initialPopulation.gen2;
        gen2 = initialPopulation.gen3;
        gen3 = initialPopulation.gen4;
        gen4 = initialPopulation.gen5;
        gen5 = initialPopulation.gen6;
        gen6 = initialPopulation.gen7 + initialPopulation.gen0;
        gen7 = initialPopulation.gen8;
        gen8 = initialPopulation.gen0
    }
    

let part1 (input: string list) = 
    let population = parsePopulation (input |> List.head)
    let resultPopulation = {1..80} |> Seq.fold (fun acc _ -> step acc) population
    let sum: int64= resultPopulation.gen0 + resultPopulation.gen1 + resultPopulation.gen2 + resultPopulation.gen3 + resultPopulation.gen4 + resultPopulation.gen5 + resultPopulation.gen6 + resultPopulation.gen7 + resultPopulation.gen8    
    sum

let part2 (input: string list) = 
    let population = parsePopulation (input |> List.head)
    let resultPopulation = {1..256} |> Seq.fold (fun acc _ -> step acc) population
    let sum: int64= resultPopulation.gen0 + resultPopulation.gen1 + resultPopulation.gen2 + resultPopulation.gen3 + resultPopulation.gen4 + resultPopulation.gen5 + resultPopulation.gen6 + resultPopulation.gen7 + resultPopulation.gen8    
    sum

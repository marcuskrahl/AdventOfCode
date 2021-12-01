module Day1
    open System

    let map_tuple l = 
        match l with
            | [a; b] -> if b > a then 1 else 0
            | _ -> 0

    let part1 (input: string list) = 
        let number_input = input |> List.map (fun x -> Convert.ToInt32(x))
        let result = number_input |> List.windowed 2 |> List.map map_tuple |> List.sum
        result

    let part2 (input: string list) = 
        let number_input = input |> List.map (fun x -> Convert.ToInt32(x))
        let result = number_input |> List.windowed 3 |> List.map List.sum |> List.windowed 2 |> List.map map_tuple |> List.sum
        result



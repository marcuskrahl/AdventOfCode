module Day23

open System

(*type Position = 
    | Hallway of int32
    | Room of (char * int32)
    

type Amphipod = {
        Name : char
        Position : Position ;
        Final : bool;
    }

let amphipods = [
        { Name= 'A'; Position= Room('A', 2); Final= false };
        { Name= 'A'; Position= Room('D', 2); Final= false };
        { Name= 'B'; Position= Room('A', 1); Final= false };
        { Name= 'B'; Position= Room('C', 1); Final= false };
        { Name= 'C'; Position= Room('B', 1); Final= false };
        { Name= 'C'; Position= Room('C', 2); Final= true };
        { Name= 'D'; Position= Room('D', 1); Final= false };
        { Name= 'D'; Position= Room('B', 2); Final= false };
    ]

let IMPOSSIBLE = 999999999;

let rec move pods cost = 
    let isOccupied c r = 
        pods |> List.exists (fun p -> p.Position = Room(c,r))

    let isOccupiedHallway hallway = 
        pods |> List.exists (fun p -> p.Position = Hallway(hallway))

    let canMove hallway room = 
        let occupiedHallways = pods |> List.map 
        (fun p -> 
                match p.Position with
                    | Hallway(h) -> h
                    | _ -> -42
            ) |> List.where (fun h -> h > -42)


    let moveHallway pod = 
        //get available spots
        42

    let moveRoom pod room =
        //check if empty
        42

    let tryMove pod = 
        match pod.Position with 
            | Room(c,2) when (isOccupied c 1) -> IMPOSSIBLE 
            | Room(c,2) when c <> pod.Name -> moveHallway pod  
            | Room(c,1) when c <> pod.Name -> moveHallway pod  
            | Hallway(p) when canMove p pod.Name -> moveRoom pod pod.Name
            | _ -> IMPOSSIBLE
        
    let movablePods = pods |> List.where (fun p -> p.Final <> true)
    let childResult = movablePods |> List.map (tryMove) |> List.min 
    cost + childResult

*)
let part1 (input: string list) = 
    //move amphipods 0
    42

let part2 (input: string list) = 
    42

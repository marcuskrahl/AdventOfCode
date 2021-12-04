module Day2
    open System

    type Movement = 
        | Forward of int
        | Up of int
        | Down of int

    let parseInput (input: string) = 
        let [operation; amountString] = input.Split(" ") |> List.ofSeq
        let amount = Convert.ToInt32(amountString)
        match operation with
            | "forward" -> Forward(amount)
            | "up" -> Up(amount) 
            | "down" -> Down(amount) 

    let move (movement, (x0, y0)) = 
        match movement with
            | Forward(x) -> (x0 + x, y0)
            | Up(x) -> (x0, y0 - x)
            | Down(x) -> (x0, y0 + x)

    let aimAndMove (movement, (x0, y0, aim)) = 
        match movement with
            | Forward(x) -> (x0 + x, y0 + x * aim, aim)
            | Up(x) -> (x0, y0, aim - x)
            | Down(x) -> (x0, y0, aim + x)

    let part1 (input: string list) = 
        let (x,y) = input |> List.map parseInput |> List.fold (fun pos movement -> move(movement, pos)) (0,0)
        x * y

    let part2 (input: string list) = 
        let (x,y, _) = input |> List.map parseInput |> List.fold (fun pos movement -> aimAndMove(movement, pos)) (0,0,0)
        x * y



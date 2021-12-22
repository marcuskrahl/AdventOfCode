module Day21

open System


let getRolls (currentRolls) = 
    let rangeRolls = currentRolls % 100
    let rolls = [rangeRolls + 1 ; rangeRolls + 2; rangeRolls + 3] |> List.map (fun r -> if r > 100 then r - 100 else r)
    (rolls, currentRolls + 3)


let scorePlayer position currentScore roll =
    let newPosition = (position + roll) % 10
    let newPosition = if newPosition = 0 then 10 else newPosition
    (newPosition, currentScore + newPosition)

let playGame s1 s2 =
    let rec playGameRec (p1, s1) (p2, s2) die = 
        let (p1roll, newDie) = getRolls die
        let (newP1, newS1) = scorePlayer p1 s1 (p1roll |> List.sum)
        if newS1 >= 1000 then s2 * newDie
        else
        let (p2roll, newDie2) = getRolls newDie
        let (newP2, newS2) = scorePlayer p2 s2 (p2roll |> List.sum)
        if newS2 >= 1000 then newS1 * newDie2
        else
        playGameRec (newP1, newS1) (newP2, newS2) newDie2

    let p1 = (s1, 0)
    let p2 = (s2, 0)
    let die = 0
    playGameRec p1 p2 die

let playDirac s1 s2= 
    let mutable results : Map<(int * int * int * int), (int64 * int64)> = Map []
    let allRolls = List.allPairs (List.allPairs [1;2;3] [1;2;3]) [1;2;3] |> List.map (fun ((r1,r2),r3) -> r1 + r2 + r3)
    let rec playGameRec (p1, s1) (p2, s2) = 
            let existingResult : Option<int64 * int64> = results |> Map.tryFind (p1,s1,p2,s2)
            if existingResult |> Option.isSome then existingResult |> Option.get
            else
            //printfn "cache miss %d %d %d %d" p1 s1 p2 s2
            let p1Results = allRolls |> List.map (fun roll -> scorePlayer p1 s1 roll)
            let p1Wins = p1Results |> List.where (fun (_,s) -> s >= 21) |> List.length
            let p1Rest = p1Results |> List.where (fun (_,s) -> s < 21)

            let p2Results = allRolls |> List.map (fun roll -> scorePlayer p2 s2 roll)
            let p2Wins = (p1Rest |> List.length) * (p2Results |> List.where (fun (_,s) -> s >= 21) |> List.length)
            let p2Rest = p2Results |> List.where (fun (_,s) -> s < 21)

            let (p1WinsRec, p2WinsRec) = (List.allPairs p1Rest p2Rest |> List.fold (fun (t1, t2) (p1New,p2New) ->
                    let (w1, w2) = playGameRec p1New p2New  
                    (t1 + w1, t2 + w2)
                ) (0L, 0L))



            let result = (int64(p1Wins) + p1WinsRec, int64(p2Wins) + p2WinsRec) 
            results <- Map.add (p1,s1,p2,s2) result results
            result

    let p1 = (s1, 0)
    let p2 = (s2, 0)
    let result = playGameRec p1 p2 
    result

let part1 (input: string list) = 
    let s1 = Convert.ToInt32((input |> List.head).Split(":").[1])
    let s2 = Convert.ToInt32((input |> List.skip 1 |> List.head).Split(":").[1])
    playGame s1 s2 

let part2 (input: string list) = 
    let s1 = Convert.ToInt32((input |> List.head).Split(":").[1])
    let s2 = Convert.ToInt32((input |> List.skip 1 |> List.head).Split(":").[1])
    let (w1,w2) = playDirac s1 s2 
    printfn "%d %d" w1 w2
    if w1 > w2 then w1 else w2

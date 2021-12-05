module Day4

open System


let boardWidth = 5

type BoardCell = int * bool

type Board = BoardCell list list
    


let parseRow (inputRow: string ) = 
    printfn "parsing %s" inputRow
    inputRow |> fun r -> r.Split(" ", StringSplitOptions.RemoveEmptyEntries) |> List.ofSeq |> List.map Convert.ToInt32 |> List.map (fun n -> (n, false))

let parseBoard inputRows = 
    inputRows |> List.map parseRow

let markBoard number (board:Board) : Board = 
    board |> List.map (fun r -> r |> List.map (fun (n, b) -> if n = number then (n, true) else (n, b)))

let isSolved (board: Board) : bool = 
    (board |> List.exists (fun r -> r |> List.forall (fun (_,b) -> b))) || ( board |> List.transpose |> List.exists (fun r -> r |> List.forall (fun (_,b) -> b)))

let rec findSolution guesses boards = 
    let guess :: restGuess  = guesses;
    let markedBoards = boards |> List.map (markBoard guess)
    let solvedBoard = markedBoards |> List.tryFind isSolved
    match solvedBoard with
        | Some b -> (b, guess)
        | None -> findSolution restGuess markedBoards

let unmarkedSum board = 
    board |> List.map (fun r -> r |> List.fold (fun acc (n,b) -> acc + if not b then n else 0) 0) |> List.sum

let part1 (input: string list) = 
    let guesses = input|> List.head |> fun r -> r.Split(",") |> List.ofSeq |> List.map Convert.ToInt32
    let boards = input |> List.tail |> List.chunkBySize 6 |> List.map (fun x -> x |> List.tail |> parseBoard)
    let (board, guess)  = findSolution guesses boards
    let sum = unmarkedSum board
    printfn "%d" guess
    printfn "%d" sum
    printfn "%A" board
    sum * guess

let rec findLastBoard guesses boards = 
    match boards with 
        | [board] -> board
        | _ ->
            let (winningBoard, _) = findSolution guesses boards
            printfn "found winning board"
            printfn "%A" winningBoard
            let normalizedWinningBoard = winningBoard |> List.map (fun r -> r |> List.map (fun (n,b) -> (n, false)))
            findLastBoard guesses (boards |> List.except [normalizedWinningBoard])

let part2 (input: string list) = 
    let guesses = input|> List.head |> fun r -> r.Split(",") |> List.ofSeq |> List.map Convert.ToInt32
    let boards = input |> List.tail |> List.chunkBySize 6 |> List.map (fun x -> x |> List.tail |> parseBoard)
    let lastBoard = findLastBoard guesses boards
    let (board, guess)  = findSolution guesses [lastBoard]
    let sum = unmarkedSum board
    printfn "%d" guess
    printfn "%d" sum
    printfn "%A" board
    sum * guess

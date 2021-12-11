module Day10

open System

type Symbol =
    | SquareOpen
    | SquareClose
    | ArrowOpen
    | ArrowClose
    | CurlyOpen
    | CurlyClose
    | RoundOpen
    | RoundClose

let parseLine (input: string) = 
    input.ToCharArray() |> List.ofSeq |> List.map (fun c -> match c with
        | '(' -> RoundOpen
        | ')' -> RoundClose
        | '{' -> CurlyOpen
        | '}' -> CurlyClose
        | '[' -> SquareOpen
        | ']' -> SquareClose
        | '<' -> ArrowOpen
        | '>' -> ArrowClose
    )

let isOpenSymbol symbol = 
    match symbol with
        | RoundOpen -> true
        | ArrowOpen -> true
        | SquareOpen -> true
        | CurlyOpen -> true
        | _ -> false

let isCloseSymbol symbol = 
    isOpenSymbol symbol = false


let inverseSymbol symbol =
    match symbol with
        | RoundOpen -> RoundClose
        | RoundClose -> RoundOpen
        | ArrowOpen -> ArrowClose
        | ArrowClose -> ArrowOpen
        | CurlyOpen -> CurlyClose
        | CurlyClose -> CurlyOpen
        | SquareOpen -> SquareClose
        | SquareClose -> SquareOpen

let scoreSymbol symbol =
    match symbol with
        | RoundClose -> 3
        | SquareClose -> 57
        | CurlyClose -> 1197
        | ArrowClose -> 25137
        | _ -> 0

let checkLine (line: Symbol list) = 
    let rec checkLineRec restLine symbolStack =
        match restLine with
            | [] -> None
            | symbol :: rest when isOpenSymbol symbol -> checkLineRec rest ( symbol :: symbolStack )
            | symbol :: rest when isCloseSymbol symbol ->
                let stackSymbol :: stackRest = symbolStack
                if symbol = inverseSymbol stackSymbol then
                    checkLineRec rest stackRest
                else 
                    Some (inverseSymbol stackSymbol, symbol)
    checkLineRec line []

let autoCompleteLine (line: Symbol list) = 
    let rec autoCompleteLineRec restLine symbolStack =
        match restLine with
            | [] -> match symbolStack with 
                | [] -> None
                | _ -> Some (symbolStack |> List.map inverseSymbol)
            | symbol :: rest when isOpenSymbol symbol -> autoCompleteLineRec rest ( symbol :: symbolStack )
            | symbol :: rest when isCloseSymbol symbol ->
                let stackSymbol :: stackRest = symbolStack
                if symbol = inverseSymbol stackSymbol then
                    autoCompleteLineRec rest stackRest
                else 
                    None
    autoCompleteLineRec line []

let scoreAutocomplete (result: Symbol list) = 
    let rec scoreRec res score =
        match res with
            | [] -> score
            | symbol :: rest -> 
                let newScore = score * 5L + match symbol with
                    | RoundClose -> 1L
                    | SquareClose -> 2L
                    | CurlyClose -> 3L
                    | ArrowClose -> 4L
                scoreRec rest newScore
    scoreRec result 0L

let part1 (input: string list) = 
    let symbolLines = input |> List.map parseLine
    symbolLines |> List.map checkLine |> List.filter Option.isSome |> List.map Option.get |> List.map (fun (_, actual) -> scoreSymbol actual) |> List.sum 

let getListMiddle input =
    let len = input |> List.length
    let middleIndex = len / 2;
    input |> List.item middleIndex

let part2 (input: string list) = 
    let symbolLines = input |> List.map parseLine
    let scores = symbolLines |> List.map autoCompleteLine |> List.filter Option.isSome |> List.map Option.get |> List.map scoreAutocomplete |> List.sort
    printfn "%A" scores
    scores |> getListMiddle

module Day16

open System

type PackageContent = 
        | Literal of int64
        | Operator of Package list
    and Package =
        { Version: int; Type: int; Content: PackageContent  }


let parseHex (input: string) = 
    input.ToCharArray() |> List.ofSeq |> List.map (fun c -> match c with
        | '0' -> [0;0;0;0]
        | '1' -> [0;0;0;1]
        | '2' -> [0;0;1;0]
        | '3' -> [0;0;1;1]
        | '4' -> [0;1;0;0]
        | '5' -> [0;1;0;1]
        | '6' -> [0;1;1;0]
        | '7' -> [0;1;1;1]
        | '8' -> [1;0;0;0]
        | '9' -> [1;0;0;1]
        | 'A' -> [1;0;1;0]
        | 'B' -> [1;0;1;1]
        | 'C' -> [1;1;0;0]
        | 'D' -> [1;1;0;1]
        | 'E' -> [1;1;1;0]
        | 'F' -> [1;1;1;1]
    ) |> List.concat

let binToDec (input: int list) =
    input |> List.fold (fun acc curr -> acc * 2L + (int64 curr)) 0L  

let parseLiteral input = 
    printfn "parse literal"
    let rec parseLiteralRec input acc offset = 
        let literalPart = input |> List.take 5
        let flag = literalPart |> List.head
        let numberPart = literalPart |> List.tail |> binToDec
        match flag with
            | 1 -> parseLiteralRec (input |> List.skip 5) (16L * acc + numberPart) (offset + 5)
            | 0 -> (16L * acc + numberPart, offset + 5)
    let (value, offset) = parseLiteralRec input 0L 0
    printfn "literal result %d %d" value offset
    (Literal value, offset)

let rec parsePackages input = 

    let rec parsePackage (input: int list) =
        let parseTotalOperator input length =
            printfn "parse total %d" length
            let (packages, offset) = parsePackages (input |> List.take length)
            (Operator packages, length)

        let parseCountOperator input count = 
            printfn "subpackages: %d" count
            let rec parseCountOperatorRec currentInput currentCount = 
                printfn "parse subpackages rec %d" currentCount
                let (package, offset) = parsePackage currentInput
                match currentCount with
                    | 1 -> ([package], offset)
                    | _ -> 
                        let (restPackages, restOffset) = parseCountOperatorRec (currentInput |> List.skip offset) (currentCount - 1)
                        (package::restPackages, restOffset + offset)
            let (content, offset) = parseCountOperatorRec input count
            (Operator content, offset)

        let parseOperator input = 
            let mode = input |> List.head
            match mode with 
                | 0 -> 
                    let totalLength = input |> List.tail |> List.take 15 |> binToDec
                    let (value, offset) = parseTotalOperator (input |> List.skip 16) (int32 totalLength)
                    (value, offset + 16)
                | 1 ->
                    let count = input |> List.tail |> List.take 11 |> binToDec
                    let (value, offset) = parseCountOperator (input |> List.skip 12) (int32 count)
                    (value, offset + 12)

        let version = int32 (input |> List.take 3 |> binToDec)
        let typeValue = int32 (input |> List.skip 3 |> List.take 3 |> binToDec)
        let (content, offset) = match typeValue with
            | 4 ->  parseLiteral (input |> List.skip 6) 
            | _ -> parseOperator (input |> List.skip 6)
        let package = { Version = version; Type = typeValue; Content = content }
        (package, offset + 6)



    if input |> List.length < 8 then ([], 0)
    else
        let (package, offset) = parsePackage input
        let (restPackages, restOffset) = parsePackages (input |> List.skip offset)
        (package :: restPackages, offset + restOffset)

let rec getVersionsRec package = 
    let version = package.Version
    match package.Content with 
        | Literal _ -> version
        | Operator packages -> (packages |> List.map getVersionsRec |> List.sum ) + version

let rec evaluatePackage package = 
    match package.Content with
        | Literal v -> int64 v
        | Operator subPackages -> 
            let evaluatedPackages = subPackages |> List.map evaluatePackage
            match package.Type with
                | 0 -> evaluatedPackages |> List.sum
                | 1 -> evaluatedPackages |> List.fold (fun acc curr -> acc * curr) 1L
                | 2 -> evaluatedPackages |> List.min
                | 3 -> evaluatedPackages |> List.max
                | 5 -> 
                    let [p1;p2] = evaluatedPackages
                    if p1 > p2 then 1L else 0L
                | 6 -> 
                    let [p1;p2] = evaluatedPackages
                    if p1 < p2 then 1L else 0L
                | 7 -> 
                    let [p1;p2] = evaluatedPackages
                    if p1 = p2 then 1L else 0L

let part1 (input: string list) = 
    let ([package], _) = input |> List.head |> parseHex |> parsePackages
    printfn "%A" package
    package |>  getVersionsRec

let part2 (input: string list) = 
    let ([package], _) = input |> List.head |> parseHex |> parsePackages
    printfn "%A" package
    package |>  evaluatePackage

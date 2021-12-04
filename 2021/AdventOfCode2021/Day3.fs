module Day3

open System

exception NotFound of string

type Binary = 
    | One
    | Zero

let inputToBinary (input: string) = 
    input.ToCharArray() |> List.ofSeq |> List.map (fun e -> if e = '1' then One else Zero)

let matchBinary ((o,z), binary) = 
     match binary with 
        | One -> (o+1, z)
        | Zero -> (o, z+1)

let mostSignificant (row: Binary list) = 
    let (ones, zeroes) = row |> List.fold (fun curr b -> matchBinary(curr, b)) (0,0)
    if zeroes > ones then Zero else One

let binaryToNumber (binary: Binary list) = 
    binary |> List.fold (fun acc digit -> acc * 2 + if digit = One then 1 else 0) 0

let inverse (number: Binary list) =
    number |> List.map (fun d -> if d = One then Zero else One)

let filterToMostSignificant position (numbers: Binary list list): Binary list list =
    let mostSignificantDigit = numbers |> List.map (fun d -> List.item position d) |> mostSignificant
    numbers |> List.filter (fun d -> List.item position d = mostSignificantDigit) 

let filterToLeastSignificant position (numbers: Binary list list): Binary list list =
    let mostSignificantDigit = numbers |> List.map (fun d -> List.item position d) |> mostSignificant
    numbers |> List.filter (fun d -> List.item position d <> mostSignificantDigit) 
    
let rec filterRec position (numbers: Binary list list): Binary list = 
    match numbers with 
        | [result] -> result
        | [] -> raise (NotFound("not found"))
        | _ -> numbers |> filterToMostSignificant position |> filterRec (position + 1)

let rec filterRecLeast position (numbers: Binary list list): Binary list = 
    match numbers with 
        | [result] -> result
        | [] -> raise (NotFound("not found"))
        | _ -> numbers |> filterToLeastSignificant position |> filterRecLeast (position + 1)
            

let part1 input = 
    let binaries = input |> List.map inputToBinary |> List.transpose |> List.map mostSignificant
    let gamma = binaries |> binaryToNumber
    let epsilon = binaries |> inverse |> binaryToNumber 
    gamma * epsilon

let part2 input = 
    let binaries = input |> List.map inputToBinary 
    let oxygen = binaries |> filterRec 0 |> binaryToNumber
    let co2 = binaries |> filterRecLeast 0  |> binaryToNumber 
    printfn "%d %d" oxygen co2
    oxygen * co2

module Day24

open System

type RegisterOrValue = 
    | Register of int
    | Value of int

type Instruction = 
    | Inp of int
    | Add of (int * RegisterOrValue)
    | Mul of (int * RegisterOrValue)
    | Div of (int * RegisterOrValue)
    | Mod of (int * RegisterOrValue)
    | Eql of (int * RegisterOrValue)

let getRegister register = 
    match register with 
        | "w" -> 0
        | "x" -> 1
        | "y" -> 2
        | "z" -> 3

let getRegisterOrNumber (register: string) = 
    let firstChar = register.[0]
    match firstChar with 
        | 'w' -> Register (getRegister register)
        | 'x' -> Register (getRegister register)
        | 'y' -> Register (getRegister register)
        | 'z' -> Register (getRegister register)
        | _ -> Value (Convert.ToInt32(register))

let parseInstruction (input: string) = 
    if input.StartsWith("inp") then
        let register = input.Split(" ").[1]
        Inp (getRegister register)
    else
    let [command; register; registerOrNumber] = input.Split(" ") |> List.ofSeq
    let a = getRegister register;
    let b = getRegisterOrNumber registerOrNumber; 
    match command with 
        | "add" -> Add (a,b)
        | "mul" -> Mul (a,b)
        | "div" -> Div (a,b)
        | "mod" -> Mod (a,b)
        | "eql" -> Eql (a,b)

let getValue (registers: int[]) reg = 
    match reg with 
        | Register r -> registers.[r] 
        | Value v -> v  

let runInstruction instruction (registers: int[]) input = 
    match instruction with
        | Inp a ->
            let i :: rest = input 
            registers.[a] <- i
            (registers, rest)
        | Add (a,b) -> 
            let av = registers.[a]
            let bv = getValue registers b
            registers.[a] <- av + bv
            (registers, input)
        | Mul (a,b) ->
            let av = registers.[a]
            let bv = getValue registers b
            registers.[a] <- av * bv
            (registers, input)
        | Div (a,b) ->
            let av = registers.[a]
            let bv = getValue registers b
            registers.[a] <- av / bv
            (registers, input)
        | Mod (a,b) ->
            let av = registers.[a]
            let bv = getValue registers b
            registers.[a] <- av % bv
            (registers, input)
        | Eql (a,b) ->
            let av = registers.[a]
            let bv = getValue registers b
            registers.[a] <- if av = bv then 1 else 0
            (registers, input)

let runProgram instructions input = 
    let (finalRegisters, _) = instructions |> List.fold (fun (reg, inp) instr -> runInstruction instr reg inp) ([|0;0;0;0|], input) 
    finalRegisters


let getModelNumbers = 
    let splitNumber n = 
        let ns = $"{n}".ToCharArray() |> List.ofSeq |> List.map (fun c -> int(c) - 48)
        if ns |> List.contains 0 then None else Some ns 
    seq {
        for i in 99999999999999L .. -1L .. 11111111111111L do
            let split = splitNumber i
            match split with
                | Some n -> yield n
                | None -> ()
    }


let part1 (input: string list) = 
    let instructions = input |> List.map parseInstruction
    let mutable i = 0L
    let number = getModelNumbers |> Seq.find (fun m ->
                                                i <- i + 1L
                                                if i % 10000L  = 0L then printfn "%d" i else ()
                                                let result = runProgram instructions m
                                                result.[3] = 0
                                              )
    printfn "%A" number
    42

let part2 (input: string list) = 
    42

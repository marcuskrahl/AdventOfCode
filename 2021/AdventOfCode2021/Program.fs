﻿

// For more information see https://aka.ms/fsharp-console-apps
[<EntryPoint>]
let main(args) = 
    let fileName = args.[0] + "_input"
    let fileContent = Util.readInput fileName
    let result = fileContent |> List.ofSeq |> Day25.part1
    printfn "%d" result
    0

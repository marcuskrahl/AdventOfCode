

// For more information see https://aka.ms/fsharp-console-apps
[<EntryPoint>]
let main(args) = 
    let fileName = args[0]
    let fileContent = Util.readInput fileName
    printfn "Hello from F#"
    0

module Day22

open System

type Mode = 
    | On
    | Off

type Command = (Mode * (int64 * int64 * int64) * (int64 * int64 * int64))

let parseInput (input: string) : Command = 
    let mode = if input.StartsWith("on") then On else Off
    let coordinates = input.Substring(3).Split(",") |> Seq.map (fun s -> s.Split("=").[1].Split("..") |> List.ofSeq |> List.map (fun d -> Convert.ToInt64(d))) |> List.ofSeq |> List.transpose
    let [[x1;y1;z1];[x2;y2;z2]] = coordinates
    (mode, (x1,y1,z1), (x2 + 1L,y2 + 1L,z2 + 1L))


let isIntersecting ((x11,y11,z11), (x12, y12, z12)) ((x21,y21,z21), (x22,y22,z22)) = 
    if x21 >= x12 || y21 >= y12 || z21 >= z12 then false
    else if x11 >= x22 || y11 >= y22 || z11 >= z22 then false
    else true

let min n1 n2 =
    if n1 < n2 then n1 else n2

let max n1 n2 =
    if n1 > n2 then n1 else n2


let splitCube ((x1,y1,z1),(x2,y2,z2)) (xs, ys, zs) = 
    [
        (x1,y1, z1), (min xs x2,min ys y2,min zs z2); 
        (max xs x1,y1, z1), (x2,min ys y2, min zs z2); 
        (x1,max ys y1, z1), (min xs x2,y2, min zs z2); 
        (max xs x1,max ys y1, z1), (x2,y2,min zs z2); 
        (x1,y1, max zs z1), (min xs x2,min ys y2,z2); 
        (max xs x1,y1, max zs z1), (x2,min ys y2,z2); 
        (x1,max ys y1, max zs z1), (min xs x2,y2,z2); 
        (max xs x1,max ys y1, max zs z1), (x2,y2,z2); 
    ]  |> List.where (fun ((xr1,yr1, zr1),(xr2,yr2,zr2)) -> xr1 < xr2 && yr1 < yr2 && zr1 < zr2) |> List.distinct

let isInside ((x1,y1,z1),(x2,y2,z2)) (xs, ys, zs) =
    if xs < x1 || xs >= x2 then false
    else if ys < y1 || ys >= y2 then false
    else if zs < y1 || zs >= z2 then false
    else true

let isTotalInside ((x11,y11,z11), (x12,y12,z12)) ((x21,y21,z21), (x22,y22,z22)) = 
    x11 >= x21 && x12 <= x22 && y11 >= y21 && y12 <= y22 && z11 >= z21 && z12 <= z22

let toRange v vMin vMax = 
    if v < vMin then vMin
    else if v > vMax then vMax
    else v

let doSplitInside mode oldCube newCube = 
    let ((x11,y11,z11), (x12,y12,z12)) = oldCube
    let ((x21,y21,z21), (x22,y22,z22)) = newCube
    //printfn "================="
    //printfn "old cube %A" oldCube
    //printfn "new cube %A" newCube

    if isTotalInside oldCube newCube then
        match mode with
            | On -> [newCube]
            | Off -> []
    else if isTotalInside newCube oldCube && mode = On then
        [oldCube]
    else
    let intersectingOld = 
        [
            (x21, y21, z21); 
            (x21, y21, z22); 
            (x21, y22, z21); 
            (x21, y22, z22); 
            (x22, y21, z21); 
            (x22, y21, z22); 
            (x22, y22, z21); 
            (x22, y22, z22 )
        ] |> List.map ( fun (x,y,z) -> ((toRange x x11 x12), (toRange y y11 y12), (toRange z z11 z12)))  |> List.where (isInside oldCube )
    let intersectingNew = 
        [
            x11, y11, z11; 
            x11, y11, z12; 
            x11, y12, z11; 
            x11, y12, z12; 
            x12, y11, z11; 
            x12, y11, z12; 
            x12, y12, z11; 
            x12, y12, z12 
        ] |> List.map ( fun (x,y,z) -> ((toRange x x21 x22), (toRange y y21 y22), (toRange z z21 z22)))  |> List.where (isInside newCube)

    //printfn "intersecting old %A" intersectingOld
    //printfn "intersecting new %A" intersectingNew


    let cubeFold cubes splitPoint = 
        let intersectingCube = cubes |> List.tryFind (fun c -> isInside c splitPoint) 
        match intersectingCube with
            | Some cube -> (splitCube cube splitPoint) @ (cubes |> List.except [cube])
            | None -> cubes

    let splitOld = intersectingOld @ (List.rev intersectingOld) |> List.fold cubeFold [oldCube] 
    let splitNew = intersectingNew @ (List.rev intersectingNew) |> List.fold cubeFold [newCube]

    //printfn "split old cubes %A" splitOld
    //printfn "split new cubes %A" splitNew
    let result =
        if mode = On 
        then (splitOld @ splitNew) |> List.distinct
        else splitOld |> List.except splitNew
    //printfn "result %A" result
    //printfn "================="
    result

let doSplitOutside mode oldCube newCube = 
    let ((x11,y11,z11), (x12,y12,z12)) = oldCube
    let ((x21,y21,z21), (x22,y22,z22)) = newCube
    let intersectingOld = 
        ( 
            (if x11 < x21 then x21 else x22),
            (if y11 < y21 then y21 else y22),
            (if z11 < z21 then z21 else z22)
        )
    let intersectingNew = 
        ( 
            (if x21 < x11 then x11 else x12),
            (if y21 < y11 then y11 else y12),
            (if z21 < z11 then z11 else z12)
        )
    let splitOld = splitCube oldCube intersectingOld
    let splitNew = splitCube newCube intersectingNew
    if mode = On 
    then (splitOld @ splitNew) |> List.distinct
    else splitOld |> List.except splitNew

let doSplit mode cube newCube = 
    let ((x11,y11,z11), (x12,y12,z12)) = cube
    let ((x21,y21,z21), (x22,y22,z22)) = newCube
    if (x21 >= x11 && x22 <= x12) || (y21 >= y11 && y22 <= y12) || (z21 >= z11 && z22 <= z12) || 
        (x11 >= x21 && x12 <= x22) || (y11 >= y21 && y12 <= y22) || (z11 >= z21 && z12 <= z22)  
    then doSplitInside mode cube newCube 
    else doSplitOutside mode cube newCube

let normalizeCubes (cube1,cube2) = 
    if cube1 = cube2 
    then [cube1]
    else if not (isIntersecting cube1 cube2) then [cube1; cube2]
    else doSplit On cube1 cube2 

let normalizeResults cubes = 
    List.allPairs cubes cubes |> List.map normalizeCubes |> List.concat |> List.distinct

let applyCommand cubes command = 
    let (mode, cMin, cMax) = command
    let newCube = (cMin, cMax)

    let intersectingCubes = cubes |> List.where (fun c -> isIntersecting c newCube)
    if intersectingCubes |> List.isEmpty then
        match mode with
            | On -> newCube :: cubes
            | Off -> cubes
    else
    let intersectionResult = intersectingCubes |> List.map (fun c -> doSplit mode c newCube) |> List.concat
    normalizeResults (intersectionResult @ (cubes |> List.except intersectingCubes))

let countCubes cubes : int64 = 
    cubes |> List.map (fun ((x1,y1,z1),(x2,y2,z2)) -> (z2 - z1) * (y2 - y1) * (x2 - x1)) |> List.sum

let part1 (input: string list) = 
    let commands = input |> List.map parseInput
    let finalCubes = commands |> List.fold (fun cubes command -> printfn "cubes: %d  lit: %d\r\n cubes: %A" (cubes |> List.length) (cubes |> countCubes) cubes; applyCommand cubes command) []
    finalCubes |> countCubes

let part2 (input: string list) = 
    42L

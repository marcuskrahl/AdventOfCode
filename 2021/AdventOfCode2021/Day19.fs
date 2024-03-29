module Day19

open System

type ScannerReading = { Number: int; Readings: (int * int * int) list }

type Operation =
    | Nothing
    | SwapXY
    | SwapXZ
    | SwapYZ
    | ShiftLeft
    | ShiftRight

type ScannerTree = { 
        Scanner: ScannerReading;
        Offset: Operation * (int * int *int) * (int * int * int);
        Children: ScannerTree list;
    }

let parseScannerLines (lines: string list) =
    let firstLine :: restLines = lines
    let number = Convert.ToInt32(firstLine.Replace("--- scanner ", "").Replace(" ---",""))
    let readings = restLines |> List.map (fun s -> 
            let [x;y;z] = s.Split(",") |> List.ofSeq |> List.map (fun n -> Convert.ToInt32(n)) 
            (x,y,z)
        )
    { Number = number; Readings = readings }

let rec parseInput (input: string list) =
    let index = input |> List.tryFindIndex (fun s -> s = "")
    match index with 
        | None -> [parseScannerLines input]
        | Some i -> 
            let (scannerLines, remainingLines) = input |> List.splitAt i
            let scanner = parseScannerLines scannerLines
            scanner :: (remainingLines |> List.tail |> parseInput)


let getRelativeCoordinates (x1,y1,z1) (x2,y2,z2) = 
    (x1 - x2, y1 - y2, z1 - z2)


let abs x = if x < 0 then -x else x

let matchesCoordinatesRelaxed (x1, y1, z1) (x2, y2, z2) = 
    let ax1 = abs x1
    let ax2 = abs x2
    let ay1 = abs y1
    let ay2 = abs y2
    let az1 = abs z1
    let az2 = abs z2
    ax1 = ax2 && ay1 = ay2 && az1 = az2
    || ax1 = ax2 && ay1 = az2 && az1 = ay2
    || ax1 = az2 && ay1 = ay2 && az1 = ax2
    || ax1 = ay2 && ay1 = ax2 && az1 = az2
    || ax1 = ay2 && ay1 = az2 && az1 = ax2
    || ax1 = az2 && ay1 = ax2 && az1 = ay2

let findOperation (x1, y1, z1) (x2, y2, z2) = 
    let ax1 = abs x1
    let ax2 = abs x2
    let ay1 = abs y1
    let ay2 = abs y2
    let az1 = abs z1
    let az2 = abs z2
    if ax1 = ax2 && ay1 = ay2 && az1 = az2 then Nothing
    else if ax1 = ax2 && ay1 = az2 && az1 = ay2 then SwapYZ
    else if  ax1 = az2 && ay1 = ay2 && az1 = ax2 then SwapXZ
    else if ax1 = ay2 && ay1 = ax2 && az1 = az2 then SwapXY
    else if ax1 = ay2 && ay1 = az2 && az1 = ax2 then ShiftLeft
    else ShiftRight

let findMultiplication (x1, y1, z1) (x2, y2, z2) =
    (
        (if x1 <> x2 then -1 else 1),
        (if y1 <> y2 then -1 else 1),
        (if z1 <> z2 then -1 else 1)
    )

let normalize (x,y,z) operation (xm,ym,zm) = 
    let (xd, yd, zd) = match operation with
        | Nothing -> (x,y,z)
        | SwapXY -> (y,x,z)
        | SwapXZ -> (z,y,x)
        | SwapYZ -> (x,z,y)
        | ShiftLeft -> (y,z,x)
        | ShiftRight -> (z,x,y)
    (xd * xm, yd * ym, zd * zm)

let getOffset ((x11,y11,z11), (x12, y12,z12)) ((x21, y21, z21), (x22, y22, z22)) =
    if (x21 - x11 = x22 - x12) && (y21 - y11 = y22 - y12) && (z21 - z11 = z22 - z12)
    then ((x21 - x11),(y21 - y11),(z21 - z11))
    else ((x21 - x12),(y21 - y12),(z21 - z12))

let normalizeOffset operation matrix (xo,yo,zo) (x,y,z) = 
    let (xn,yn,zn) = normalize (x,y,z) operation matrix
    ((xn - xo), (yn - yo), (zn - zo))

let triangulateScanners s1 s2 = 
    printfn "Triangulating %d with %d" s1.Number s2.Number
    let sourcePairs = List.allPairs s1.Readings s1.Readings
    sourcePairs |> List.tryPick (fun (b11, b12) -> 
        if b11 = b12 then None
        else
        let relativeCoordinates = getRelativeCoordinates b11 b12
        let otherCoordinates = List.allPairs s2.Readings s2.Readings |> List.map (fun (b1,b2) -> ((b1,b2), getRelativeCoordinates b1 b2))
        let validCoordinates = otherCoordinates |> List.where (fun (_, rel) -> matchesCoordinatesRelaxed relativeCoordinates rel)
        if List.isEmpty validCoordinates then None
        else
        let [validCoordinate; _] = validCoordinates
        //printfn "%A" relativeCoordinates
        //printfn "%A" validCoordinate
        let (validAbsolute,validRelative) = validCoordinate
        let operation = findOperation relativeCoordinates validRelative
        let n1 = normalize validRelative operation (1,1,1)
        let matrix = findMultiplication relativeCoordinates n1
        let normalized = normalize validRelative operation matrix
        //printfn "%A" normalized 
        let (b21, b22) = validAbsolute
        let b21 = normalize b21 operation matrix
        let b22 = normalize b22 operation matrix
        let offset = getOffset (b11,b12) (b21, b22)
        //printfn "%A" offset
        
        let normalizedCoordinates = s2.Readings |> List.map (fun (x,y,z) -> normalizeOffset operation matrix offset (x,y,z))
        let sameCoordinates = normalizedCoordinates |> List.map (fun coords -> if List.contains coords s1.Readings then 1 else 0) |> List.sum
        printfn "same coordinates: %d" sameCoordinates
        if sameCoordinates >= 12 then Some(operation,matrix, offset) else None
        )

let getChildren sourceScanner scanners = 
    let rec getChildrenRec sourceScanner visitedScanners = 
        let childScanners = 
            scanners 
                |> List.where (fun s -> not (visitedScanners |> List.contains s.Number)) 
                |> List.map (fun s -> ((triangulateScanners sourceScanner s) |> Option.map (fun r -> (s,r))))
                |> List.where Option.isSome 
                |> List.map Option.get

        let blockedScanners = childScanners |> List.map (fun (s,_) -> s.Number)
        childScanners |> List.map (fun (childScanner, result) -> 
                let childResult = getChildrenRec childScanner (visitedScanners @ blockedScanners)
                { Scanner = childScanner;
                  Offset = result;
                  Children = childResult
                  }
            )
    let result = getChildrenRec sourceScanner [sourceScanner.Number]
    result

let absoluteBeacons children = 
    let rec absoluteBeaconsRec children operations = 
        children |> List.map (fun child -> 
                printfn "Scanner %d (Offset: %A)" child.Scanner.Number child.Offset
                let newOperations = operations @ [child.Offset]
                let points = child.Scanner.Readings |> List.map (fun r -> 
                    newOperations |> List.rev |> List.fold (fun acc (op, mat, off) -> normalizeOffset op mat off acc) r
                )
                for (x,y,z) in points do
                    printfn "%d %d %d" x y z
                points @ absoluteBeaconsRec child.Children newOperations
            ) |> List.concat |> List.distinct
    absoluteBeaconsRec children []

let absoluteScanners children = 
    let rec absoluteScannersRec children operations = 
        children |> List.map (fun child -> 
                printfn "Scanner %d (Offset: %A)" child.Scanner.Number child.Offset
                let newOperations = operations @ [child.Offset]
                let offset = newOperations |> List.rev |> List.fold (fun acc (op, mat, off) -> normalizeOffset op mat off acc) (0,0,0)
                printfn "abs offset: %A" offset
                offset :: absoluteScannersRec child.Children newOperations
            ) |> List.concat 
    absoluteScannersRec children []


let getBeaconCount scanners = 
    let s1 :: _= scanners
    let children = getChildren s1 scanners
    let beaconPositions = (s1.Readings @ absoluteBeacons children) |> List.distinct
    printfn "%A %d" beaconPositions (beaconPositions |> List.length)
    beaconPositions |> List.length

let manhattanDistance (x1,y1,z1) (x2,y2,z2) = 
   (abs (x1 - x2)) + (abs (y1 - y2)) + (abs (z1 - z2))

let getScannerDistance scanners = 
    let s1 :: _= scanners
    let children = getChildren s1 scanners
    let absScanners = absoluteScanners children
    printfn "%A" absScanners
    List.allPairs absScanners absScanners 
        |> List.map (fun (s1, s2) -> manhattanDistance s1 s2) 
        |> List.max

let part1 (input: string list) = 
    let readings = parseInput input
    getBeaconCount readings

let part2 (input: string list) = 
    let readings = parseInput input
    getScannerDistance readings

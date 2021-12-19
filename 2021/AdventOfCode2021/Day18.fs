module Day18

open System

type Pair = PairValue * PairValue
    and PairValue =
        | Value of int
        | NestedPair of Pair

let rec parsePair (input: string) = 
    let rec parsePart (part:string) = 
        if part.StartsWith("[") 
        then NestedPair (parsePair part)
        else 
            let v = Convert.ToInt32(part)
            Value v

    let mutable commaPosition = 0
    let mutable layer = 0;
    for i in 0..(input.Length - 1) do
        let c = input.[i]
        match c with 
            | ',' when layer = 1 -> commaPosition <- i
            | '[' -> layer <- layer + 1
            | ']' -> layer <- layer - 1
            | _ -> ()
    let firstPart = input.Substring(1, commaPosition - 1)
    let secondPart = input.Substring(commaPosition + 1, input.Length - commaPosition - 2)
    ( parsePart firstPart), (parsePart secondPart)

let add one two = 
    NestedPair (one, two)

let rec pairToString pair = 
    let (left, right) = pair
    let leftStr = match left with
        | Value v -> $"{v}"
        | NestedPair p -> $"{pairToString p}"
    let rightStr = match right with
        | Value v -> $"{v}"
        | NestedPair p -> $"{pairToString p}"
    $"[{leftStr},{rightStr}]"


let getValue v =
    match v with
        | Value a -> a
        | _ -> raise (System.ArgumentException("expected value"))

let getPair p =
    match p with
        | NestedPair a -> a
        | _ -> raise (System.ArgumentException("expected pair"))

let explode completePair = 
    let rec getExplodePosition pair position = 
        if position |> List.length >= 4 
        then Some ((position |> List.rev), pair)
        else
            let (left, right) = pair
            let leftResult = match left with 
                | Value _ -> None
                | NestedPair p -> getExplodePosition p (0::position)
            if leftResult |> Option.isSome then leftResult
            else 
            match right with
                | Value _ -> None
                | NestedPair p -> getExplodePosition p (1::position)


    let rec incPosition position value pair = 
        //printfn "inc position %A %d" position value
        match position with 
            | [0] -> 
                let (leftValue, rightValue) = pair
                let newLeftValue = (leftValue |> getValue) + value
                (Value newLeftValue, rightValue)
            | [1] ->    
                let (leftValue, rightValue) = pair
                let newRightValue = (rightValue |> getValue) + value
                //printfn "new right value %d" newRightValue
                (leftValue, Value newRightValue)
            | 0::rest -> 
                let (leftPair, rightPair) = pair 
                let newLeftPair = incPosition rest value (leftPair |> getPair)
                (NestedPair newLeftPair, rightPair)
            | 1::rest -> 
                let (leftPair, rightPair) = pair 
                let newRightPair = incPosition rest value (rightPair |> getPair)
                (leftPair, NestedPair newRightPair)

    let getAllPositions pair = 
        let rec getAllPositionsRec pair position = 
            seq { 
                let (left, right) = pair
                match left with 
                    | Value v -> 
                        yield ((0::position) |> List.rev)
                    | NestedPair p -> 
                        yield! getAllPositionsRec p (0::position)
                match right with 
                    | Value v -> 
                        yield ((1::position) |> List.rev)
                    | NestedPair p -> 
                        yield! getAllPositionsRec p (1::position)
            }
        (getAllPositionsRec pair []) |> List.ofSeq

    let tryExplodeLeft explodePosition leftValue pair =
        let isSmallerPosition position = 
            let rec isSmallerPositionRec l1 l2 = 
                if List.isEmpty l1 && List.isEmpty l2 then false
                else if List.isEmpty l1 then false
                else if List.isEmpty l2 then false
                else
                let (e1 :: r1) = l1;
                let (e2 :: r2) = l2;
                if e1 < e2 then true
                else if e1 > e2 then false
                else isSmallerPositionRec r1 r2
               
            isSmallerPositionRec position explodePosition

        let getLeftPosition position pair = 
            let allPositions = getAllPositions pair
            let smallerPositions = allPositions |> List.filter isSmallerPosition
            //printfn "%A" smallerPositions
            if smallerPositions |> List.isEmpty 
            then None
            else Some (smallerPositions |> List.last)
            
        let leftPosition = getLeftPosition explodePosition pair
        match leftPosition with 
            | Some p -> incPosition p leftValue pair
            | None -> pair

    let tryExplodeRight explodePosition rightValue pair =
        let isLargerPosition position = 
            let rec isLargerPositionRec l1 l2 = 
                if List.isEmpty l1 && List.isEmpty l2 then false
                else if List.isEmpty l1 then false
                else if List.isEmpty l2 then false
                else
                let (e1 :: r1) = l1;
                let (e2 :: r2) = l2;
                if e1 > e2 then true
                else if e1 < e2 then false
                else isLargerPositionRec r1 r2
               
            isLargerPositionRec position explodePosition

        let getRightPosition position pair = 
            let allPositions = getAllPositions pair
            let largerPositions = allPositions |> List.filter isLargerPosition
            //printfn "right: %A" largerPositions
            if largerPositions |> List.isEmpty 
            then None
            else Some (largerPositions |> List.head)
            
        let rightPosition = getRightPosition explodePosition pair
        match rightPosition with 
            | Some p -> incPosition p rightValue pair
            | None -> pair

    let tryExplodeRemaining explodePosition pair = 
        let rec tryExplodeRec position pair = 
            //printfn "explode %A %A" position pair
            let (left, right) = pair
            match position with
                | [0] -> (Value 0, right)
                | [1] -> (left, Value 0)
                | 0 :: rest -> 
                    let newLeft = tryExplodeRec rest (left |> getPair)
                    (NestedPair newLeft, right)
                | 1 :: rest -> 
                    let newRight = tryExplodeRec rest (right |> getPair)
                    (left, NestedPair newRight)

        tryExplodeRec explodePosition pair

    let explodeResult = getExplodePosition completePair []
    let result = match explodeResult with
        | Some (position, (leftValue, rightValue)) ->
            //printfn "%A %A %A" position leftValue rightValue
            let result = 
                completePair 
                    |> tryExplodeLeft position (leftValue |> getValue)
                    |> tryExplodeRight position (rightValue |> getValue)
                    |> tryExplodeRemaining position
            //printfn "explode result: %A" result
            (result, true)
        | None -> 
            //printfn "nothing to explode"
            (completePair, false)
    result

let splitValue v = 
    let v1 = v / 2;
    let v2 = v1 + if v % 2 = 1 then 1 else 0;
    NestedPair (Value v1, Value v2)

let rec split pair =
    let (left, right) = pair
    let (newLeft, leftResult) = match left with
        | Value v when v > 9 -> (splitValue v, true)
        | Value v when v <= 9 -> (Value v, false)
        | NestedPair p -> 
            let (newPair, res) = split p
            (NestedPair newPair, res)
    if leftResult = true then
        ((newLeft, right), true)
    else 
    let (newRight, rightResult) = match right with
        | Value v when v > 9 -> (splitValue v, true)
        | Value v when v <= 9 -> (Value v, false)
        | NestedPair p ->
            let (newPair, res) = split p
            (NestedPair newPair, res)
    ((left, newRight), rightResult)

let rec reducePair pair = 
    let (explodeResult, didExplode) = explode pair
    if didExplode then 
        printfn "did explode %s" (explodeResult |> pairToString)
        reducePair explodeResult
    else 
    let (splitResult, didSplit) = split pair
    if didSplit then
        printfn "did split %s" (splitResult |> pairToString)
        reducePair splitResult
    else 
    pair

let addPair p1 p2 = 
    (NestedPair p1, NestedPair p2)

let rec magnitude (left,right) = 
    let leftValue = match left with
     | Value v -> int64 v
     | NestedPair p -> magnitude p
    let rightValue = match right with
     | Value v -> int64 v
     | NestedPair p -> magnitude p
    leftValue * 3L + rightValue * 2L

let highestMagnitude numbers = 
    List.allPairs numbers numbers |> List.map (fun (n1, n2) -> 
        if n1 = n2 then 0L
        else addPair n1 n2 |> reducePair |> magnitude
    ) |> List.max

let part1 (input: string list) = 
    let pairs = input |> List.map parsePair 
    let firstPair::restPairs = pairs 
    let result = restPairs |> List.fold (fun acc curr -> curr |> addPair acc |> reducePair) firstPair
    printfn "%s" (result |> pairToString)
    magnitude result

let part2 (input: string list) = 
    let pairs = input |> List.map parsePair 
    highestMagnitude pairs

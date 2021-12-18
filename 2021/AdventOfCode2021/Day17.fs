module Day17

open System

let parseInput (input: string) = 
    let [|xRange; yRange|] = input.Replace("target area: x=", "").Replace(" y=","").Split(",")
    let [xMin; xMax] = xRange.Split("..") |> List.ofSeq |> List.map (fun n -> Convert.ToInt32(n))
    let [yMin; yMax] = yRange.Split("..") |> List.ofSeq |> List.map (fun n -> Convert.ToInt32(n))
    (xMin,xMax),(yMin,yMax) 

let rec reachesAreaAndVelocity (x,y) (vx,vy) area reachedY = 
    let (xMin, xMax), (yMin, yMax) = area
    if x > xMax then (false,reachedY)
    else if y < yMin && vx = 0 then (false,reachedY)
    else if x >= xMin && x <= xMax && y >= yMin && y <= yMax then (true, reachedY)
    else
        let newPos = (x + vx), (y+vy)
        let newVx = if vx > 0 then vx - 1 else if vx < 0 then vx + 1 else 0
        let newVy = vy - 1
        let newReachedY = if (y+vy) > reachedY then y+vy else reachedY
        reachesAreaAndVelocity newPos (newVx, newVy) area newReachedY

let reachesArea (x,y) (vx,vy) area = 
    let (result, _) = reachesAreaAndVelocity (x,y) (vx,vy) area y
    result



let highestTrajectory area =
    let mutable highest = 0
    for vx in 0..100 do
        for vy in 0..100 do 
            let (result, yMax) = reachesAreaAndVelocity (0,0) (vx,vy) area 0 
            if result = true && yMax > highest then highest <- yMax else () 
    highest

let allTrajectory area =
    let mutable count = 0
    for vx in 0..300 do
        for vy in -100..100 do 
            let (result, yMax) = reachesAreaAndVelocity (0,0) (vx,vy) area 0 
            if result = true then count <- count + 1 else () 
    count


let part1 (input: string list) = 
    let area = input |> List.head |> parseInput
    highestTrajectory area

let part2 (input: string list) = 
    let area = input |> List.head |> parseInput
    allTrajectory area

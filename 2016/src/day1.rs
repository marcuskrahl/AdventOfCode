
enum Direction {
    Left(i32),
    Right(i32)
}

enum Facing {
    North,
    West,
    South,
    East
}

struct Position {
    x: i32,
    y: i32,
    facing: Facing
}

fn str_to_direction(input: &str) -> Direction {
    let steps = input[1..].trim().parse::<i32>().unwrap();
    match &input[0..1] {
        "L" => Direction::Left(steps),
        "R" => Direction::Right(steps),
        _ => panic!("unknown case")
    }
}

fn move_position(position:&Position, direction:&Direction) -> Position {
    match (direction, &position.facing) {
        (Direction::Left(steps), Facing::North) =>  Position { x:position.x - steps,y:position.y, facing: Facing::West},
        (Direction::Left(steps), Facing::East) =>  Position { x:position.x, y:position.y - steps, facing: Facing::North},
        (Direction::Left(steps), Facing::South) =>  Position { x:position.x + steps,y:position.y, facing: Facing::East},
        (Direction::Left(steps), Facing::West) =>  Position { x:position.x, y:position.y + steps, facing: Facing::South},
        (Direction::Right(steps), Facing::South) =>  Position { x:position.x - steps,y:position.y, facing: Facing::West},
        (Direction::Right(steps), Facing::West) =>  Position { x:position.x, y:position.y - steps, facing: Facing::North},
        (Direction::Right(steps), Facing::North) =>  Position { x:position.x + steps,y:position.y, facing: Facing::East},
        (Direction::Right(steps), Facing::East) =>  Position { x:position.x, y:position.y + steps, facing: Facing::South},
    }
}

pub fn part1(input: &String) -> u64 {
    let movements = input.split(", ").map(|s| str_to_direction(s));
    let position = movements.fold( Position { x:0, y:0, facing: Facing::North }, |curr, acc| move_position(&curr, &acc));
    u64::from(position.x.unsigned_abs() + position.y.unsigned_abs())
}

fn get_positions(old_x: i32, old_y: i32, new_x: i32, new_y: i32) -> Vec<(i32,i32)> {
    let mut result: Vec<(i32,i32)> = Vec::new();
    if old_x == new_x {
        let min_y = if old_y < new_y { old_y} else { new_y + 1};
        let max_y = if old_y < new_y { new_y} else { old_y + 1};
        for y in min_y..max_y {
            result.push((old_x, y));
        } 
    } else {
        let min_x = if old_x < new_x { old_x} else { new_x + 1};
        let max_x = if old_x < new_x { new_x} else { old_x + 1};
        for x in min_x..max_x {
            result.push((x, old_y));
        } 
    }
    result
}

pub fn part2(input: &String) -> u64 {
    let movements = input.split(", ").map(|s| str_to_direction(s));
    let mut position = Position { x:0, y:0, facing: Facing::North };
    let mut visited_positions: Vec<(i32,i32)> = Vec::new();
    for movement in movements {
        let new_position = move_position(&position, &movement);
        let positions = get_positions(position.x, position.y, new_position.x, new_position.y);
        for pos in positions {
                if visited_positions.contains(&pos) {
                    return u64::from(pos.0.unsigned_abs() + pos.1.unsigned_abs())
                }
                visited_positions.push(pos);
        }
        position = new_position;
    }
    panic!("no crossing found")
}


#[test]
fn test_part1() {
    assert_eq!(part1(&String::from("R2, L3")),5);
    assert_eq!(part1(&String::from("R2, R2, R2")),2);
    assert_eq!(part1(&String::from("R5, L5, R5, R3")), 12);
}

#[test]
fn test_part2() {
    assert_eq!(part2(&String::from("R8, R4, R4, R8")),4);
}
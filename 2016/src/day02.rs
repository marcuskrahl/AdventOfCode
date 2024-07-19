enum Direction {
    Up,
    Down,
    Left,
    Right
}

fn parse_direction(dir: char) -> Option<Direction> {
    match dir {
        'U' => Some(Direction::Up),
        'D' => Some(Direction::Down),
        'L' => Some(Direction::Left),
        'R' => Some(Direction::Right),
        _ => None
    }
}

fn move_pos(current: (u32, u32), direction: Direction) -> (u32, u32) {
    let (x,y) = current;
    match direction {
        Direction::Up   if y > 0  => (x, y-1),
        Direction::Down if y < 2  => (x, y+1),
        Direction::Left if x > 0  => (x-1, y),
        Direction::Right if x < 2 => (x+1, y),
        _ => (x,y)
    }
}

fn move_pos_2(current: (u32, u32), direction: Direction) -> (u32, u32) {
    let (x,y) = current;
    //println!("\t{} {}",x,y);
    match direction {
        Direction::Up if (y > 2 || y == 2 && (1..=3).contains(&x) || y == 1 && x == 2) => (x, y-1),
        Direction::Down if (y < 2 || y == 2 && (1..=3).contains(&x) || y == 3 && x == 2)=> (x, y+1),
        Direction::Left if (x > 2 || x == 2 && (1..=3).contains(&y) || x == 1 && y == 2) => (x-1, y),
        Direction::Right if (x < 2 || x == 2 && (1..=3).contains(&y) || x == 3 && y == 2)=> (x+1, y),
        _ => (x,y)
    }
}

fn get_pos(pos: (u32,u32)) -> u64 {
    match pos {
        (0,0) => 1,
        (1,0) => 2,
        (2,0) => 3,
        (0,1) => 4,
        (1,1) => 5,
        (2,1) => 6,
        (0,2) => 7,
        (1,2) => 8,
        (2,2) => 9,
        _ => panic!("outside of board")
    } 
}

fn get_pos_2(pos: (u32,u32)) -> u64 {
    match pos {
        (2,0) => 1,
        (1,1) => 2,
        (2,1) => 3,
        (3,1) => 4,
        (0,2) => 5,
        (1,2) => 6,
        (2,2) => 7,
        (3,2) => 8,
        (4,2) => 9,
        (1,3) => 0xA,
        (2,3) => 0xB,
        (3,3) => 0xC,
        (2,4) => 0xD,
        _ => panic!("outside of board")
    } 
}

pub fn part1(input: &String) -> u64 {
    let (result, _)  = input
        .trim()
        .split("\n")
        .fold((0u64,(1,1)), |(value, pos), line|  {
            let new_pos = line.chars()
                .map(|c| parse_direction(c))
                .flatten()
                .fold(pos, |current_pos, d| move_pos(current_pos, d) );
            (value * 10 + get_pos(new_pos), new_pos)
        });
    result
}

pub fn part2(input: &String) -> String {
    let (result, _)  = input
        .trim()
        .split("\n")
        .fold((0u64,(0,2)), |(value, pos), line|  {
            let new_pos = line.chars()
                .map(|c| parse_direction(c))
                .flatten()
                .fold(pos, |current_pos, d| move_pos_2(current_pos, d) );
            //let (x,y) = new_pos;
            //println!("{} {}", x,y);
            (value * 16 + get_pos_2(new_pos), new_pos)
        });
    let result_str = format!("{:0X}", result);
    result_str
}


#[test]
fn test_part1() {
    let input="ULL
RRDDD
LURDL
UUUUD";
    assert_eq!(part1(&String::from(input)),1985);
}

#[test]
fn test_part2() {
    
    let input="ULL
RRDDD
LURDL
UUUUD";
    assert_eq!(part2(&String::from(input)), "5DB3");
}

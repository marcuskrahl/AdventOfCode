use once_cell::sync::Lazy;
use regex::Regex;

enum Operation {
    Rect(usize, usize),
    RotateRow(usize,usize),
    RotateColumn(usize, usize)
}

impl Operation {
    fn from_str(s: &str) -> Operation {
        static rect_regex: Lazy<Regex> = Lazy::new(|| Regex::new(r"rect (\d+)x(\d+)").unwrap());
        static rotate_regex: Lazy<Regex> = Lazy::new(|| Regex::new(r"rotate (\w+) \w=(\d+) by (\d+)").unwrap());
        let rect_match = rect_regex.captures(s);
        if let Some(captures) = rect_match {
            let (_,[a, b]) = captures.extract();
            return Operation::Rect(a.parse().unwrap(), b.parse().unwrap());
        }
        let rotate_match = rotate_regex.captures(s);
        if let Some(captures) = rotate_match {
            let (_,[kind, r, b]) = captures.extract();
            return match kind {
                "column" => Operation::RotateColumn(r.parse().unwrap(), b.parse().unwrap()),
                "row" => Operation::RotateRow(r.parse().unwrap(), b.parse().unwrap()),
                _ => panic!("unknown rorate kind {}", kind)
            };
        }
        panic!("unknown operation: {}", s)
    }
}

fn run_lighting<const width: usize, const height: usize>(input: &String) -> [[u8; height]; width] {
    let mut grid = [[0u8; height]; width];
    let operations = input.lines().map(|l| Operation::from_str(l));
    for operation in operations {
        match operation {
            Operation::Rect(xe,ye) => {
                for x in 0..xe {
                    for y in 0..ye {
                        grid[x][y] = 1;
                    }
                } 
            },
            Operation::RotateRow(y, amount) => {
                let mut orig = [0u8; width];
                for x in 0..width {
                    orig[x] = grid[x][y];
                }
                for x in 0..width {
                    let target = (x + amount) % width;
                    grid[target][y] = orig[x]
                }
            },
            Operation::RotateColumn(x, amount) => {
                let mut orig = [0u8; height];
                for y in 0..height {
                    orig[y] = grid[x][y];
                }
                for y in 0..height {
                    let target = (y + amount) % height;
                    grid[x][target] = orig[y];
                }
            }
        }
    }
    grid
} 

fn count_lights<const width: usize, const height: usize>(grid: &[[u8; height]; width]) -> u64 {
    let mut sum = 0;
    for x in 0..width {
        for y in 0..height {
            if grid[x][y] > 0 {
                sum += 1;
            }
        }
    }
    sum
}

fn print_grid<const width: usize, const height: usize>(grid: &[[u8; height]; width]) -> String {
    let mut output = String::new();
    for y in 0..height {
        output.push('\n');
        for x in 0..width {
            let c = if grid[x][y] > 0 { '#' } else { ' '};
            output.push(c);
        }
    }
    output
}

pub fn part1(input: &String) -> u64 {
    let final_grid = run_lighting::<50,6>(input);
    count_lights(&final_grid) 
}

pub fn part2(input: &String) -> String {
    let final_grid = run_lighting::<50,6>(input);
    print_grid(&final_grid)
}


#[test]
fn test_part1() {
    let input = String::from("rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1");
    let result = count_lights(&run_lighting::<7,3>(&input));
    assert_eq!(result,6);
}

#[test]
fn test_part2() {
    let input = String::from("rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1");
    let expected = String::from("
 #  # #
# #    
 #     ");
    let result = print_grid(&run_lighting::<7,3>(&input));
    assert_eq!(result, expected);
}

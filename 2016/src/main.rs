use std::{fs, time::Instant, time::Duration, env};
use std::fmt::{Display,Formatter,Result};

mod day01;
mod day02;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        panic!("Please provide the day(s) to run as a command-line argument.");
    }

    let day = &args[1];

    if day == "all" {

        let mut total = Duration::new(0,0);
        for d in 1..=2 {
            let d_str = format!("{:02}",d);
            let input =  fs::read_to_string(format!("input/day{}.txt", d_str)).unwrap();
            
            let start = Instant::now();
            solve(&d_str, 1, &input);
            solve(&d_str, 2, &input);
            let time = start.elapsed();
            total += time;
            println!("Day {}: {:?}",d_str, time)
        }

        println!("==========================================");
        println!("Total: {:?}", total);
            
    } else {
        let input =  fs::read_to_string(format!("input/day{}.txt", day)).unwrap();
        println!("Start");
        
        let start = Instant::now();
        println!("part 1: {}", solve(day, 1, &input));
        println!("part 2: {}", solve(day, 2, &input));
        println!("Time: {:?}", start.elapsed())
    }
}

enum Solution {
    Str(String),
    U64(u64)
}

impl Display for Solution {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        match self {
            Solution::U64(x) => x.fmt(f),
            Solution::Str(x) => x.fmt(f)
        }
    }
}

fn solve(day: &String, part: u8, input: &String) -> Solution {
    match (day.as_str(), part) {
        ("01", 1) => Solution::U64(day01::part1(input)),
        ("01", 2) => Solution::U64(day01::part2(input)),
        ("02", 1) => Solution::U64(day02::part1(input)),
        ("02", 2) => Solution::Str(day02::part2(input)),
        _ => panic!("day not found")
    }
}

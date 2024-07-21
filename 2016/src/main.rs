use std::{fs, time::Instant, time::Duration, env, io::Result};
use std::fmt::{Display,Formatter};

mod day01;
mod day02;
mod day03;
mod day04;
mod day05;
mod day06;
mod day07;
mod day08;
mod day09;
mod day10;
mod day11;
mod day12;
mod day13;
mod day14;
mod day15;
mod day16;
mod day17;
mod day18;
mod day19;
mod day20;
mod day21;
mod day22;
mod day23;
mod day24;
mod day25;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        panic!("Please provide the day(s) to run as a command-line argument.");
    }

    let day = &args[1];

    if day == "all" {

        let mut total = Duration::new(0,0);
        for d in 1..=25 {
            let d_str = format!("{:02}",d);
            let input_opt =  fs::read_to_string(format!("input/day{}.txt", d_str));
            if let Result::Err(_) = input_opt {
                println!("Day {}: not solved yet", d_str);
                continue;
            }
            let input = input_opt.unwrap();
            
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
        let input =  fs::read_to_string(format!("input/day{}.txt", day));
        if input.is_err() {
            println!("WARNING: no input defined");
        }

        let input = input.unwrap_or(String::from(""));
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
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
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
        ("03", 1) => Solution::U64(day03::part1(input)),
        ("03", 2) => Solution::U64(day03::part2(input)),
        ("04", 1) => Solution::U64(day04::part1(input)),
        ("04", 2) => Solution::U64(day04::part2(input)),
        ("05", 1) => Solution::Str(day05::part1(input)),
        ("05", 2) => Solution::Str(day05::part2(input)),
        ("06", 1) => Solution::U64(day06::part1(input)),
        ("06", 2) => Solution::U64(day06::part2(input)),
        ("07", 1) => Solution::U64(day07::part1(input)),
        ("07", 2) => Solution::U64(day07::part2(input)),
        ("08", 1) => Solution::U64(day08::part1(input)),
        ("08", 2) => Solution::U64(day08::part2(input)),
        ("09", 1) => Solution::U64(day09::part1(input)),
        ("09", 2) => Solution::U64(day09::part2(input)),
        ("10", 1) => Solution::U64(day10::part1(input, 17, 61)),
        ("10", 2) => Solution::U64(day10::part2(input)),
        ("11", 1) => Solution::U64(day11::part1(input)),
        ("11", 2) => Solution::U64(day11::part2(input)),
        ("12", 1) => Solution::U64(day12::part1(input)),
        ("12", 2) => Solution::U64(day12::part2(input)),
        ("13", 1) => Solution::U64(day13::part1(input)),
        ("13", 2) => Solution::U64(day13::part2(input)),
        ("14", 1) => Solution::U64(day14::part1(input)),
        ("14", 2) => Solution::U64(day14::part2(input)),
        ("15", 1) => Solution::U64(day15::part1(input)),
        ("15", 2) => Solution::U64(day15::part2(input)),
        ("16", 1) => Solution::U64(day16::part1(input)),
        ("16", 2) => Solution::U64(day16::part2(input)),
        ("17", 1) => Solution::U64(day17::part1(input)),
        ("17", 2) => Solution::U64(day17::part2(input)),
        ("18", 1) => Solution::U64(day18::part1(input)),
        ("18", 2) => Solution::U64(day18::part2(input)),
        ("19", 1) => Solution::U64(day19::part1(input)),
        ("19", 2) => Solution::U64(day19::part2(input)),
        ("20", 1) => Solution::U64(day20::part1(input)),
        ("20", 2) => Solution::U64(day20::part2(input)),
        ("21", 1) => Solution::U64(day21::part1(input)),
        ("21", 2) => Solution::U64(day21::part2(input)),
        ("22", 1) => Solution::U64(day22::part1(input)),
        ("22", 2) => Solution::U64(day22::part2(input)),
        ("23", 1) => Solution::U64(day23::part1(input)),
        ("23", 2) => Solution::U64(day23::part2(input)),
        ("24", 1) => Solution::U64(day24::part1(input)),
        ("24", 2) => Solution::U64(day24::part2(input)),
        ("25", 1) => Solution::U64(day25::part1(input)),
        ("25", 2) => Solution::U64(day25::part2(input)),
        _ => panic!("day not found")
    }
}

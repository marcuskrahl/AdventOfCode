use std::{fs, time::Instant};

mod day1;

fn main() {

    let input =  fs::read_to_string("input/day01.txt").unwrap();
    println!("Start");
    
    let start = Instant::now();
    println!("part 1: {}", day1::part1(&input));
    println!("part 2: {}", day1::part2(&input));
    println!("Time: {:?}", start.elapsed())
}

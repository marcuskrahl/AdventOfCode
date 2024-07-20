use regex::Regex;
use once_cell::sync::Lazy;
use std::collections::HashMap;

const BOT_COUNT :usize= 255;
const OUTPUT_COUNT:usize = 255;
#[derive(Clone, Debug, Copy)]
struct Bot {
    low: u32,
    high: u32
}

enum TargetKind {
    Bot,
    Output
}
enum Instruction {
    Input { target: u32, value: u32},
    Transfer { source: u32, low_target: (TargetKind, u32), high_target: (TargetKind, u32) }
}

fn parse_target(s: &str) -> (TargetKind, u32) {
    let split: Vec<&str> = s.split(" ").collect();
    let kind = split[0];
    let target_id = split[1];
    match kind {
        "bot" => (TargetKind::Bot, target_id.parse().unwrap()),
        "output" => (TargetKind::Output, target_id.parse().unwrap()),
        _ => panic!("cannot parse target {}", s)
    }
}

impl Instruction {
    fn from_str(s: &str) -> Instruction {
        static input_regex: Lazy<Regex> = Lazy::new(|| Regex::new(r"value (\d+) goes to bot (\d+)").unwrap());
        static transfer_regex: Lazy<Regex> = Lazy::new(|| Regex::new(r"bot (\d+) gives low to (\w+ \d+) and high to (\w+ \d+)").unwrap());
        let input_match = input_regex.captures(s);
        if let Some(captures) = input_match {
            let (_,[value, target]) = captures.extract();
            return Instruction::Input {
                value: value.parse().unwrap(),
                target: target.parse().unwrap(),

            };
        }
        let transfer_match = transfer_regex.captures(s);
        if let Some(captures) = transfer_match {
            let (_,[source, low, high]) = captures.extract();
            return Instruction::Transfer {
                source: source.parse().unwrap(),
                low_target: parse_target(&low),
                high_target: parse_target(&high),
            };
        }
        panic!("unknown instruction: {}", s)
    }
}

fn give_to_bot(bot:&mut Bot, value: u32) {
    if bot.low == 0 {
        bot.low = value;
    } else if bot.low > value {
        bot.high = bot.low;
        bot.low = value;
    } else {
        bot.high = value;
    }
}

fn give_to_bot_or_output(target:&(TargetKind, u32),bots:&mut  [Bot; BOT_COUNT],output:&mut  [u32; OUTPUT_COUNT], value: u32)  -> () {
    match target {
        (TargetKind::Bot, target_id) => give_to_bot(&mut bots[*target_id as usize], value),
        (TargetKind::Output, target_id) => output[*target_id as usize] = value
    }

}

pub fn part1(input: &String, compare_low: u32, compare_high: u32) -> u64 {
    let instructions: Vec<Instruction> = input.trim().split("\n").map(|line| Instruction::from_str(line)).collect();
    let mut bots = [Bot { low: 0, high: 0};BOT_COUNT];
    let mut output= [0;OUTPUT_COUNT];
    for instruction in &instructions {
        match instruction {
            Instruction::Input { target, value } => give_to_bot(&mut bots[*target as usize], *value),
            _ => ()
        }
    }
    loop {
        let bot_index_opt = bots.iter().position(|b| b.low > 0 && b.high > 0);
        if let Some(bot_index) = bot_index_opt {
            let bot = &mut bots[bot_index];
            let bot_low = bot.low;
            let bot_high = bot.high;
            if bot_low == compare_low && bot_high == compare_high {
                return bot_index as u64;
            }
            bot.low = 0;
            bot.high = 0;
            for instruction in &instructions {
                match instruction {
                    Instruction::Transfer { source, low_target, high_target } if *source == bot_index as u32 => {
                        give_to_bot_or_output(&low_target, &mut bots, &mut output, bot_low);
                        give_to_bot_or_output(&high_target, &mut bots,&mut output, bot_high);
                    }
                    _ => ()
                } 
            }
        } else {
            break;
        }
    }
    0
}

pub fn part2(input: &String) -> u64 {
    let instructions: Vec<Instruction> = input.trim().split("\n").map(|line| Instruction::from_str(line)).collect();
    let mut bots = [Bot { low: 0, high: 0};BOT_COUNT];
    let mut output= [0;OUTPUT_COUNT];
    for instruction in &instructions {
        match instruction {
            Instruction::Input { target, value } => give_to_bot(&mut bots[*target as usize], *value),
            _ => ()
        }
    }
    loop {
        let bot_index_opt = bots.iter().position(|b| b.low > 0 && b.high > 0);
        if let Some(bot_index) = bot_index_opt {
            let bot = &mut bots[bot_index];
            let bot_low = bot.low;
            let bot_high = bot.high;
            bot.low = 0;
            bot.high = 0;
            for instruction in &instructions {
                match instruction {
                    Instruction::Transfer { source, low_target, high_target } if *source == bot_index as u32 => {
                        give_to_bot_or_output(&low_target, &mut bots, &mut output, bot_low);
                        give_to_bot_or_output(&high_target, &mut bots,&mut output, bot_high);
                    }
                    _ => ()
                } 
            }
        } else {
            break;
        }
    }
    (output[0] as u64) * (output[1] as u64) * (output [2] as u64)
}

const TEST_INPUT: &str = "
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
";

#[test]
fn test_part1() {

    let input = String::from(TEST_INPUT.trim());
    assert_eq!(part1(&input, 2,5),2);
}

#[test]
fn test_part2() {
    let input = String::from(TEST_INPUT.trim());
    assert_eq!(part2(&input),30);
}

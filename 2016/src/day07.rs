
fn is_tls(input: &str) -> bool {
    let chars = input.chars().collect::<Vec<char>>();
    let mut inside = false;
    let mut is_match = false;
    for (pos, c) in chars.iter().filter(|c| !c.is_whitespace()).enumerate() {
        if pos > chars.len() - 4 {
            break;
        }
        else if *c == '[' {
            inside = true;
            continue;
        }
        else if *c == ']' {
            inside = false;
            continue;
        }
        else if chars[pos]  == chars[pos+3] && chars[pos+1] == chars[pos+2] && chars[pos] != chars[pos+1] {
            if inside {
                return false;
            } else {
                is_match = true;
            }
        }
    }
    is_match
}

fn is_ssl(input: &str) -> bool {
    let chars = input.chars().collect::<Vec<char>>();
    let mut inside = false;
    let mut abas: Vec<(char,char)> = Vec::new();
    let mut babs: Vec<(char,char)> = Vec::new();
    for (pos, c) in chars.iter().filter(|c| !c.is_whitespace()).enumerate() {
        if pos > chars.len() - 3 {
            break;
        }
        else if *c == '[' {
            inside = true;
            continue;
        }
        else if *c == ']' {
            inside = false;
            continue;
        }
        else if chars[pos]  == chars[pos+2] && chars[pos] != chars[pos+1] {
            if inside {
                babs.push((chars[pos], chars[pos+1]));
            } else {
                abas.push((chars[pos], chars[pos+1]));
            }
        }
    }
    abas.iter().any(|(a,b)| babs.iter().any(|(x,y)| a == y && b == x))
}

pub fn part1(input: &String) -> u64 {
    input.split("\n").filter(|l| is_tls(l)).collect::<Vec<&str>>().len() as u64
}

pub fn part2(input: &String) -> u64 {
    input.split("\n").filter(|l| is_ssl(l)).collect::<Vec<&str>>().len() as u64
}


#[test]
fn test_part1() {
    assert_eq!(is_tls("abba[mnop]qrst"), true);
    assert_eq!(is_tls("abcd[bddb]xyyx"), false);
    assert_eq!(is_tls("aaaa[qwer]tyui"), false);
    assert_eq!(is_tls("ioxxoj[asdfgh]zxcvbn"), true);
    assert_eq!(is_tls("ioxxoj[abba]zxcvbn"), false);
}

#[test]
fn test_part2() {
    assert_eq!(is_ssl("aba[bab]xyz"),true);
    assert_eq!(is_ssl("xyx[xyx]xyx"),false);
    assert_eq!(is_ssl("aaa[kek]eke"),true);
    assert_eq!(is_ssl("zazbz[bzb]cdb"),true);
}

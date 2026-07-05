import type { Exercise } from '@/types/exercise'

export const exercises: Exercise[] = [
  {
    id: 1,
    slug: 'starts_with_uppercase',
    title: 'Starts with uppercase',
    description: 'Does this string start with an uppercase letter?',
    starterCode: `//! Does this string start with an uppercase letter?

pub fn starts_with_uppercase(s: String) -> bool {
    if s.len() == 0 {
        return false;
    }
    let first = s.chars().nth(0).unwrap();
    if first.is_uppercase() == true {
        return true;
    } else {
        return false;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uppercase_first() {
        assert!(starts_with_uppercase("Hello".to_string()));
    }

    #[test]
    fn lowercase_first() {
        assert!(!starts_with_uppercase("hello".to_string()));
    }

    #[test]
    fn empty_string() {
        assert!(!starts_with_uppercase(String::new()));
    }

    #[test]
    fn unicode_uppercase() {
        assert!(starts_with_uppercase("Über".to_string()));
    }
}`,
    solutionCode: `//! Does this string start with an uppercase letter?
//!
//! Solution highlights:
//! - Take \`&str\` (read-only check, no need to own the string).
//! - \`chars().next()\` returns \`Option<char>\` -> handles empty for free.
//! - \`is_some_and\` collapses "exists and matches predicate" into one call.

pub fn starts_with_uppercase(s: &str) -> bool {
    s.chars().next().is_some_and(char::is_uppercase)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uppercase_first() {
        assert!(starts_with_uppercase("Hello"));
    }

    #[test]
    fn lowercase_first() {
        assert!(!starts_with_uppercase("hello"));
    }

    #[test]
    fn empty_string() {
        assert!(!starts_with_uppercase(""));
    }

    #[test]
    fn unicode_uppercase() {
        assert!(starts_with_uppercase("Über"));
    }
}`
  },
  {
    id: 2,
    slug: 'better_match',
    title: 'Better match',
    description: 'Classify a number as "prime", "square", "nothing", or "something else".',
    starterCode: `//! Classify a number as "prime", "square", "nothing", or "something else".

pub fn describe(value: Option<u32>) -> &'static str {
    match value {
        Some(2) | Some(3) | Some(5) | Some(7) => "prime",
        Some(0) | Some(1) | Some(4) | Some(9) => "square",
        None => "nothing",
        _ => "something else",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn primes() {
        for n in [2, 3, 5, 7] {
            assert_eq!(describe(Some(n)), "prime");
        }
    }

    #[test]
    fn squares() {
        for n in [0, 1, 4, 9] {
            assert_eq!(describe(Some(n)), "square");
        }
    }

    #[test]
    fn nothing_and_other() {
        assert_eq!(describe(None), "nothing");
        assert_eq!(describe(Some(11)), "something else");
    }
}`,
    solutionCode: `//! Classify a number as "prime", "square", "nothing", or "something else".
//!
//! Solution: Use if-let guards for cleaner matching.

pub fn describe(value: Option<u32>) -> &'static str {
    match value {
        Some(2 | 3 | 5 | 7) => "prime",
        Some(0 | 1 | 4 | 9) => "square",
        None => "nothing",
        _ => "something else",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn primes() {
        for n in [2, 3, 5, 7] {
            assert_eq!(describe(Some(n)), "prime");
        }
    }

    #[test]
    fn squares() {
        for n in [0, 1, 4, 9] {
            assert_eq!(describe(Some(n)), "square");
        }
    }

    #[test]
    fn nothing_and_other() {
        assert_eq!(describe(None), "nothing");
        assert_eq!(describe(Some(11)), "something else");
    }
}`
  },
  {
    id: 3,
    slug: 'even_numbers',
    title: 'Even numbers',
    description: 'Return the even numbers below `max`. Can you return something lazier and more idiomatic instead?',
    starterCode: `//! Return the even numbers below \`max\`.
//!
//! This works right now, but it eagerly builds a whole \`Vec\` and hand-rolls
//! the loop. Can you return something lazier and more idiomatic instead?
//! (You have free rein to change the signature.)

pub fn evens(max: u32) -> Vec<u32> {
    let mut result = Vec::new();
    let mut n = 0;
    while n < max {
        if n % 2 == 0 {
            result.push(n);
        }
        n += 1;
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_few() {
        assert_eq!(evens(10), vec![0, 2, 4, 6, 8]);
    }

    #[test]
    fn empty() {
        assert_eq!(evens(0), Vec::<u32>::new());
    }

    #[test]
    fn odd_bound() {
        assert_eq!(evens(7), vec![0, 2, 4, 6]);
    }
}`,
    solutionCode: `//! Return the even numbers below \`max\`.
//!
//! Solution: Use iterators with step_by for a more idiomatic approach.

pub fn evens(max: u32) -> Vec<u32> {
    (0..max).step_by(2).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_few() {
        assert_eq!(evens(10), vec![0, 2, 4, 6, 8]);
    }

    #[test]
    fn empty() {
        assert_eq!(evens(0), Vec::<u32>::new());
    }

    #[test]
    fn odd_bound() {
        assert_eq!(evens(7), vec![0, 2, 4, 6]);
    }
}`
  },
  {
    id: 4,
    slug: 'truncate_string',
    title: 'Truncate string',
    description: 'Truncate a string to at most `max_bytes` bytes.',
    starterCode: `//! Truncate a string to at most \`max_bytes\` bytes.

pub fn truncate(s: &str, max_bytes: usize) -> String {
    let mut owned = s.to_string();
    owned.truncate(max_bytes);
    owned
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ascii() {
        assert_eq!(truncate("hello world", 5), "hello");
    }

    #[test]
    fn unchanged_when_short_enough() {
        assert_eq!(truncate("hi", 100), "hi");
    }

    #[test]
    fn whole_unicode_string_fits() {
        assert_eq!(truncate("café", 5), "café");
    }
}`,
    solutionCode: `//! Truncate a string to at most \`max_bytes\` bytes.
//!
//! Solution: Use chars().take() for a more functional approach.

pub fn truncate(s: &str, max_bytes: usize) -> String {
    s.chars().take(max_bytes).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ascii() {
        assert_eq!(truncate("hello world", 5), "hello");
    }

    #[test]
    fn unchanged_when_short_enough() {
        assert_eq!(truncate("hi", 100), "hi");
    }

    #[test]
    fn whole_unicode_string_fits() {
        assert_eq!(truncate("café", 5), "café");
    }
}`
  },
  {
    id: 5,
    slug: 'path',
    title: 'Path extension',
    description: 'Does this path point to a Rust source file?',
    starterCode: `//! Does this path point to a Rust source file?

use std::path::Path;

pub fn is_rust_source_file(path: &Path) -> bool {
    match path.extension() {
        Some(ext) => match ext.to_str() {
            Some(s) => s == "rs",
            None => false,
        },
        None => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plain_rs_file() {
        assert!(is_rust_source_file(Path::new("main.rs")));
    }

    #[test]
    fn nested_rs_file() {
        assert!(is_rust_source_file(Path::new("src/lib.rs")));
    }

    #[test]
    fn other_extension() {
        assert!(!is_rust_source_file(Path::new("Cargo.toml")));
    }

    #[test]
    fn no_extension() {
        assert!(!is_rust_source_file(Path::new("README")));
    }

    #[test]
    fn dotfile_without_extension() {
        assert!(!is_rust_source_file(Path::new(".rs")));
    }
}`,
    solutionCode: `//! Does this path point to a Rust source file?
//!
//! Solution: Use is_some_and for cleaner Option handling.

use std::path::Path;

pub fn is_rust_source_file(path: &Path) -> bool {
    path.extension().is_some_and(|ext| ext == "rs")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plain_rs_file() {
        assert!(is_rust_source_file(Path::new("main.rs")));
    }

    #[test]
    fn nested_rs_file() {
        assert!(is_rust_source_file(Path::new("src/lib.rs")));
    }

    #[test]
    fn other_extension() {
        assert!(!is_rust_source_file(Path::new("Cargo.toml")));
    }

    #[test]
    fn no_extension() {
        assert!(!is_rust_source_file(Path::new("README")));
    }

    #[test]
    fn dotfile_without_extension() {
        assert!(!is_rust_source_file(Path::new(".rs")));
    }
}`
  },
  {
    id: 6,
    slug: 'nesting',
    title: 'Nesting',
    description: 'If the input is `Some` and not empty after trimming, return the uppercased trimmed text.',
    starterCode: `//! If the input is \`Some\` and not empty after trimming, return the
//! uppercased trimmed text. Otherwise return \`None\`.

pub fn shout(s: Option<&str>) -> Option<String> {
    if let Some(s) = s {
        let trimmed = s.trim();
        if !trimmed.is_empty() {
            return Some(trimmed.to_uppercase());
        } else {
            return None;
        }
    } else {
        return None;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uppercases_after_trimming() {
        assert_eq!(shout(Some("  hi  ")), Some("HI".to_string()));
    }

    #[test]
    fn none_on_none() {
        assert_eq!(shout(None), None);
    }

    #[test]
    fn none_on_empty() {
        assert_eq!(shout(Some("")), None);
    }

    #[test]
    fn none_on_whitespace_only() {
        assert_eq!(shout(Some("   ")), None);
    }
}`,
    solutionCode: `//! If the input is \`Some\` and not empty after trimming, return the
//! uppercased trimmed text. Otherwise return \`None\`.
//!
//! Solution: Use and_then for chaining Option operations.

pub fn shout(s: Option<&str>) -> Option<String> {
    s.and_then(|s| {
        let trimmed = s.trim();
        if !trimmed.is_empty() {
            Some(trimmed.to_uppercase())
        } else {
            None
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uppercases_after_trimming() {
        assert_eq!(shout(Some("  hi  ")), Some("HI".to_string()));
    }

    #[test]
    fn none_on_none() {
        assert_eq!(shout(None), None);
    }

    #[test]
    fn none_on_empty() {
        assert_eq!(shout(Some("")), None);
    }

    #[test]
    fn none_on_whitespace_only() {
        assert_eq!(shout(Some("   ")), None);
    }
}`
  },
  {
    id: 7,
    slug: 'optional_values',
    title: 'Optional values',
    description: 'Sum all `Some` values in the vector. Ignore `None` entries.',
    starterCode: `//! Sum all \`Some\` values in the vector. Ignore \`None\` entries.

pub fn sum_options(options: Vec<Option<i32>>) -> i32 {
    let mut sum = 0;
    for option in options {
        match option {
            Some(value) => sum += value,
            None => {}
        }
    }
    sum
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn typical() {
        let values = vec![Some(1), None, Some(3), None, Some(5)];
        assert_eq!(sum_options(values), 9);
    }

    #[test]
    fn empty() {
        let values: Vec<Option<i32>> = vec![];
        assert_eq!(sum_options(values), 0);
    }

    #[test]
    fn all_none() {
        let values = vec![None, None, None];
        assert_eq!(sum_options(values), 0);
    }
}`,
    solutionCode: `//! Sum all \`Some\` values in the vector. Ignore \`None\` entries.
//!
//! Solution: Use filter_map and sum for a more idiomatic approach.

pub fn sum_options(options: Vec<Option<i32>>) -> i32 {
    options.into_iter().flatten().sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn typical() {
        let values = vec![Some(1), None, Some(3), None, Some(5)];
        assert_eq!(sum_options(values), 9);
    }

    #[test]
    fn empty() {
        let values: Vec<Option<i32>> = vec![];
        assert_eq!(sum_options(values), 0);
    }

    #[test]
    fn all_none() {
        let values = vec![None, None, None];
        assert_eq!(sum_options(values), 0);
    }
}`
  },
  {
    id: 8,
    slug: 'parse_ints',
    title: 'Parse integers',
    description: 'Parse every string in the input as `i32`. Return all parsed integers, or the first error encountered.',
    starterCode: `//! Parse every string in the input as \`i32\`. Return all parsed
//! integers, or the first error encountered.

use std::num::ParseIntError;

pub fn parse_values(values: Vec<String>) -> Result<Vec<i32>, ParseIntError> {
    let mut result = Vec::new();
    for value in values {
        match value.parse::<i32>() {
            Ok(num) => result.push(num),
            Err(e) => return Err(e),
        }
    }
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_valid() {
        let values = vec!["10".to_string(), "20".to_string(), "30".to_string()];
        assert_eq!(parse_values(values), Ok(vec![10, 20, 30]));
    }

    #[test]
    fn one_invalid() {
        let values = vec!["10".to_string(), "twenty".to_string(), "30".to_string()];
        assert!(parse_values(values).is_err());
    }

    #[test]
    fn empty_input() {
        assert_eq!(parse_values(vec![]), Ok(vec![]));
    }
}`,
    solutionCode: `//! Parse every string in the input as \`i32\`. Return all parsed
//! integers, or the first error encountered.
//!
//! Solution: Use collect with Result iterator for a more idiomatic approach.

use std::num::ParseIntError;

pub fn parse_values(values: Vec<String>) -> Result<Vec<i32>, ParseIntError> {
    values.into_iter().map(|v| v.parse()).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn all_valid() {
        let values = vec!["10".to_string(), "20".to_string(), "30".to_string()];
        assert_eq!(parse_values(values), Ok(vec![10, 20, 30]));
    }

    #[test]
    fn one_invalid() {
        let values = vec!["10".to_string(), "twenty".to_string(), "30".to_string()];
        assert!(parse_values(values).is_err());
    }

    #[test]
    fn empty_input() {
        assert_eq!(parse_values(vec![]), Ok(vec![]));
    }
}`
  },
  {
    id: 9,
    slug: 'error_handling',
    title: 'Error handling',
    description: 'Read the entire contents of a file into a `String`.',
    starterCode: `//! Read the entire contents of a file into a \`String\`.

use std::fs::File;
use std::io::{self, Read};

pub fn read_file_contents(path: &str) -> io::Result<String> {
    let mut file = match File::open(path) {
        Ok(file) => file,
        Err(e) => return Err(e),
    };
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    fn write_tmp(name: &str, contents: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("refactoring_14_{}", name));
        let mut f = File::create(&path).unwrap();
        f.write_all(contents.as_bytes()).unwrap();
        path
    }

    #[test]
    fn reads_existing_file() {
        let path = write_tmp("hello.txt", "hello, world");
        let path = path.to_str().unwrap();
        assert_eq!(read_file_contents(path).unwrap(), "hello, world");
    }

    #[test]
    fn missing_file_is_error() {
        let err = read_file_contents("/definitely/does/not/exist.txt").unwrap_err();
        assert_eq!(err.kind(), io::ErrorKind::NotFound);
    }
}`,
    solutionCode: `//! Read the entire contents of a file into a \`String\`.
//!
//! Solution: Use the ? operator for cleaner error propagation.

use std::fs::File;
use std::io::{self, Read};

pub fn read_file_contents(path: &str) -> io::Result<String> {
    let mut contents = String::new();
    File::open(path)?.read_to_string(&mut contents)?;
    Ok(contents)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    fn write_tmp(name: &str, contents: &str) -> std::path::PathBuf {
        let path = std::env::temp_dir().join(format!("refactoring_14_{}", name));
        let mut f = File::create(&path).unwrap();
        f.write_all(contents.as_bytes()).unwrap();
        path
    }

    #[test]
    fn reads_existing_file() {
        let path = write_tmp("hello.txt", "hello, world");
        let path = path.to_str().unwrap();
        assert_eq!(read_file_contents(path).unwrap(), "hello, world");
    }

    #[test]
    fn missing_file_is_error() {
        let err = read_file_contents("/definitely/does/not/exist.txt").unwrap_err();
        assert_eq!(err.kind(), io::ErrorKind::NotFound);
    }
}`
  },
  {
    id: 10,
    slug: 'parse_port',
    title: 'Parse port',
    description: 'Parse a TCP port string into a `u16`.',
    starterCode: `//! Parse a TCP port string into a \`u16\`.

pub fn parse_port(s: &str) -> Option<u16> {
    let n: i32 = s.parse().ok()?;
    if n < 1 || n > 65535 {
        return None;
    }
    Some(n as u16)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_port() {
        assert_eq!(parse_port("8080"), Some(8080));
    }

    #[test]
    fn max_port() {
        assert_eq!(parse_port("65535"), Some(65535));
    }

    #[test]
    fn zero_rejected() {
        assert_eq!(parse_port("0"), None);
    }

    #[test]
    fn out_of_range_rejected() {
        assert_eq!(parse_port("65536"), None);
    }

    #[test]
    fn non_numeric_rejected() {
        assert_eq!(parse_port("nope"), None);
    }
}`,
    solutionCode: `//! Parse a TCP port string into a \`u16\`.
//!
//! Solution: Use a match expression for cleaner range checking.

pub fn parse_port(s: &str) -> Option<u16> {
    match s.parse::<u16>() {
        Ok(n @ 1..=65535) => Some(n),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_port() {
        assert_eq!(parse_port("8080"), Some(8080));
    }

    #[test]
    fn max_port() {
        assert_eq!(parse_port("65535"), Some(65535));
    }

    #[test]
    fn zero_rejected() {
        assert_eq!(parse_port("0"), None);
    }

    #[test]
    fn out_of_range_rejected() {
        assert_eq!(parse_port("65536"), None);
    }

    #[test]
    fn non_numeric_rejected() {
        assert_eq!(parse_port("nope"), None);
    }
}`
  },
  {
    id: 11,
    slug: 'dedup_runs',
    title: 'Dedup runs',
    description: 'Collapse consecutive duplicate values, keeping one per run.',
    starterCode: `//! Collapse consecutive duplicate values, keeping one per run.
//!
//! \`[1, 2, 4, 5, 5, 5, 5, 25, 5]\` becomes \`[1, 2, 4, 5, 25, 5]\`.
//! Only *adjacent* duplicates collapse, so the trailing \`5\` survives
//! because a \`25\` sits between it and the earlier run of fives.
//!
//! This works, but it hand-rolls something the standard library
//! already does in one call. Can you make it shorter?

pub fn dedup_runs(values: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    let mut i = 0;
    while i < values.len() {
        if result.is_empty() || *result.last().unwrap() != values[i] {
            result.push(values[i]);
        }
        i += 1;
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn collapses_runs_but_keeps_separated_repeats() {
        assert_eq!(
            dedup_runs(vec![1, 2, 4, 5, 5, 5, 5, 25, 5]),
            vec![1, 2, 4, 5, 25, 5]
        );
    }

    #[test]
    fn empty() {
        assert_eq!(dedup_runs(vec![]), Vec::<i32>::new());
    }

    #[test]
    fn no_duplicates_unchanged() {
        assert_eq!(dedup_runs(vec![1, 2, 3]), vec![1, 2, 3]);
    }

    #[test]
    fn all_the_same_collapses_to_one() {
        assert_eq!(dedup_runs(vec![7, 7, 7, 7]), vec![7]);
    }
}`,
    solutionCode: `//! Collapse consecutive duplicate values, keeping one per run.
//!
//! Solution: Use the standard library's dedup method.

pub fn dedup_runs(values: Vec<i32>) -> Vec<i32> {
    let mut result = values;
    result.dedup();
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn collapses_runs_but_keeps_separated_repeats() {
        assert_eq!(
            dedup_runs(vec![1, 2, 4, 5, 5, 5, 5, 25, 5]),
            vec![1, 2, 4, 5, 25, 5]
        );
    }

    #[test]
    fn empty() {
        assert_eq!(dedup_runs(vec![]), Vec::<i32>::new());
    }

    #[test]
    fn no_duplicates_unchanged() {
        assert_eq!(dedup_runs(vec![1, 2, 3]), vec![1, 2, 3]);
    }

    #[test]
    fn all_the_same_collapses_to_one() {
        assert_eq!(dedup_runs(vec![7, 7, 7, 7]), vec![7]);
    }
}`
  },
  {
    id: 12,
    slug: 'excluded_path',
    title: 'Excluded path',
    description: 'Does `path` start with any of the excluded prefixes?',
    starterCode: `//! Does \`path\` start with any of the excluded prefixes?
//! \`None\` means no exclusions are configured (so nothing is excluded).

use std::collections::HashSet;
use std::path::{Path, PathBuf};

pub fn is_excluded(excluded: &Option<HashSet<PathBuf>>, path: &Path) -> bool {
    if let Some(excluded) = excluded {
        for prefix in excluded {
            if path.starts_with(prefix) {
                return true;
            }
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    fn set(paths: &[&str]) -> Option<HashSet<PathBuf>> {
        Some(paths.iter().map(PathBuf::from).collect())
    }

    #[test]
    fn excludes_under_prefix() {
        assert!(is_excluded(&set(&["/tmp"]), Path::new("/tmp/foo.log")));
    }

    #[test]
    fn not_under_any_prefix() {
        assert!(!is_excluded(&set(&["/tmp"]), Path::new("/home/me/x")));
    }

    #[test]
    fn none_means_nothing_excluded() {
        assert!(!is_excluded(&None, Path::new("/anything")));
    }

    #[test]
    fn empty_set_excludes_nothing() {
        let ex = Some(HashSet::new());
        assert!(!is_excluded(&ex, Path::new("/tmp/foo")));
    }
}`,
    solutionCode: `//! Does \`path\` start with any of the excluded prefixes?
//! \`None\` means no exclusions are configured (so nothing is excluded).
//!
//! Solution: Use any() for a more functional approach.

use std::collections::HashSet;
use std::path::{Path, PathBuf};

pub fn is_excluded(excluded: &Option<HashSet<PathBuf>>, path: &Path) -> bool {
    excluded
        .as_ref()
        .is_some_and(|set| set.iter().any(|prefix| path.starts_with(prefix)))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn set(paths: &[&str]) -> Option<HashSet<PathBuf>> {
        Some(paths.iter().map(PathBuf::from).collect())
    }

    #[test]
    fn excludes_under_prefix() {
        assert!(is_excluded(&set(&["/tmp"]), Path::new("/tmp/foo.log")));
    }

    #[test]
    fn not_under_any_prefix() {
        assert!(!is_excluded(&set(&["/tmp"]), Path::new("/home/me/x")));
    }

    #[test]
    fn none_means_nothing_excluded() {
        assert!(!is_excluded(&None, Path::new("/anything")));
    }

    #[test]
    fn empty_set_excludes_nothing() {
        let ex = Some(HashSet::new());
        assert!(!is_excluded(&ex, Path::new("/tmp/foo")));
    }
}`
  },
  {
    id: 13,
    slug: 'spell_check',
    title: 'Spell check',
    description: 'Return the words from `words` that are not in `dict`. The check is case-insensitive.',
    starterCode: `//! Return the words from \`words\` that are not in \`dict\`. The check
//! is case-insensitive.

pub fn spell_check(words: &Vec<String>, dict: &Vec<String>) -> Vec<String> {
    let mut misspelled = Vec::new();
    for word in words {
        let mut found = false;
        for d in dict {
            if d.to_lowercase() == word.to_lowercase() {
                found = true;
                break;
            }
        }
        if !found {
            misspelled.push(word.clone());
        }
    }
    misspelled
}

#[cfg(test)]
mod tests {
    use super::*;

    fn words(ws: &[&str]) -> Vec<String> {
        ws.iter().map(|w| (*w).to_string()).collect()
    }

    #[test]
    fn detects_misspellings() {
        let dict = words(&["the", "quick", "brown", "fox"]);
        let input = words(&["The", "qucik", "brown"]);
        assert_eq!(spell_check(&input, &dict), vec!["qucik".to_string()]);
    }

    #[test]
    fn empty_input() {
        let dict = words(&["a", "b"]);
        assert!(spell_check(&vec![], &dict).is_empty());
    }
}`,
    solutionCode: `//! Return the words from \`words\` that are not in \`dict\`. The check
//! is case-insensitive.
//!
//! Solution: Use filter and any for a more functional approach.

pub fn spell_check(words: &[String], dict: &[String]) -> Vec<String> {
    words
        .iter()
        .filter(|word| !dict.iter().any(|d| d.eq_ignore_ascii_case(word)))
        .cloned()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn words(ws: &[&str]) -> Vec<String> {
        ws.iter().map(|w| (*w).to_string()).collect()
    }

    #[test]
    fn detects_misspellings() {
        let dict = words(&["the", "quick", "brown", "fox"]);
        let input = words(&["The", "qucik", "brown"]);
        assert_eq!(spell_check(&input, &dict), vec!["qucik".to_string()]);
    }

    #[test]
    fn empty_input() {
        let dict = words(&["a", "b"]);
        assert!(spell_check(&vec![], &dict).is_empty());
    }
}`
  },
  {
    id: 14,
    slug: 'room_occupancy',
    title: 'Room occupancy',
    description: 'Compute totals across a list of room occupancies. Notice the repetition between the helpers.',
    starterCode: `//! Compute totals across a list of room occupancies. Notice the
//! repetition between the helpers - every one of them follows the same
//! shape.

pub struct RoomOccupancy {
    pub adults: i32,
    pub children: Vec<i32>,
}

pub fn adults_total(rooms: &[RoomOccupancy]) -> i32 {
    let mut total = 0;
    for room in rooms {
        total += room.adults;
    }
    total
}

pub fn children_total(rooms: &[RoomOccupancy]) -> i32 {
    let mut total = 0;
    for room in rooms {
        total += room.children.len() as i32;
    }
    total
}

pub fn max_adults_in_a_room(rooms: &[RoomOccupancy]) -> i32 {
    let mut max = 0;
    for room in rooms {
        if room.adults > max {
            max = room.adults;
        }
    }
    max
}

pub fn child_ages(rooms: &[RoomOccupancy]) -> Vec<i32> {
    let mut ages = Vec::new();
    for room in rooms {
        for age in &room.children {
            ages.push(*age);
        }
    }
    ages
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Vec<RoomOccupancy> {
        vec![
            RoomOccupancy {
                adults: 3,
                children: vec![3, 6],
            },
            RoomOccupancy {
                adults: 1,
                children: vec![],
            },
        ]
    }

    #[test]
    fn sums_adults() {
        assert_eq!(adults_total(&sample()), 4);
    }

    #[test]
    fn sums_children() {
        assert_eq!(children_total(&sample()), 2);
    }

    #[test]
    fn finds_max_adults() {
        assert_eq!(max_adults_in_a_room(&sample()), 3);
    }

    #[test]
    fn flattens_ages() {
        assert_eq!(child_ages(&sample()), vec![3, 6]);
    }
}`,
    solutionCode: `//! Compute totals across a list of room occupancies.
//!
//! Solution: Use iterator methods for a more idiomatic approach.

pub struct RoomOccupancy {
    pub adults: i32,
    pub children: Vec<i32>,
}

pub fn adults_total(rooms: &[RoomOccupancy]) -> i32 {
    rooms.iter().map(|r| r.adults).sum()
}

pub fn children_total(rooms: &[RoomOccupancy]) -> i32 {
    rooms.iter().map(|r| r.children.len() as i32).sum()
}

pub fn max_adults_in_a_room(rooms: &[RoomOccupancy]) -> i32 {
    rooms.iter().map(|r| r.adults).max().unwrap_or(0)
}

pub fn child_ages(rooms: &[RoomOccupancy]) -> Vec<i32> {
    rooms.iter().flat_map(|r| r.children.iter().copied()).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Vec<RoomOccupancy> {
        vec![
            RoomOccupancy {
                adults: 3,
                children: vec![3, 6],
            },
            RoomOccupancy {
                adults: 1,
                children: vec![],
            },
        ]
    }

    #[test]
    fn sums_adults() {
        assert_eq!(adults_total(&sample()), 4);
    }

    #[test]
    fn sums_children() {
        assert_eq!(children_total(&sample()), 2);
    }

    #[test]
    fn finds_max_adults() {
        assert_eq!(max_adults_in_a_room(&sample()), 3);
    }

    #[test]
    fn flattens_ages() {
        assert_eq!(child_ages(&sample()), vec![3, 6]);
    }
}`
  },
  {
    id: 15,
    slug: 'highest_and_lowest',
    title: 'Highest and lowest',
    description: 'Given a string of space-separated integers, return the highest and lowest value.',
    starterCode: `//! Given a string of space-separated integers, return the highest
//! and lowest value.

pub fn highest_and_lowest(input: &str) -> (i64, i64) {
    let parts: Vec<&str> = input.split(' ').collect();
    let mut max: i64 = parts[0].parse().unwrap();
    let mut min: i64 = parts[0].parse().unwrap();
    for part in &parts[1..] {
        let n: i64 = part.parse().unwrap();
        if n > max {
            max = n;
        }
        if n < min {
            min = n;
        }
    }
    (max, min)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn typical() {
        assert_eq!(
            highest_and_lowest("123 3534 534 0 100000 44 222"),
            (100_000, 0)
        );
    }

    #[test]
    fn single_number() {
        assert_eq!(highest_and_lowest("42"), (42, 42));
    }

    #[test]
    fn negatives() {
        assert_eq!(highest_and_lowest("-1 -2 -3"), (-1, -3));
    }
}`,
    solutionCode: `//! Given a string of space-separated integers, return the highest
//! and lowest value.
//!
//! Solution: Use iterator methods for a more idiomatic approach.

pub fn highest_and_lowest(input: &str) -> (i64, i64) {
    let numbers: Vec<i64> = input.split_whitespace().map(|s| s.parse().unwrap()).collect();
    let max = *numbers.iter().max().unwrap();
    let min = *numbers.iter().min().unwrap();
    (max, min)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn typical() {
        assert_eq!(
            highest_and_lowest("123 3534 534 0 100000 44 222"),
            (100_000, 0)
        );
    }

    #[test]
    fn single_number() {
        assert_eq!(highest_and_lowest("42"), (42, 42));
    }

    #[test]
    fn negatives() {
        assert_eq!(highest_and_lowest("-1 -2 -3"), (-1, -3));
    }
}`
  },
  {
    id: 16,
    slug: 'mode',
    title: 'Mode',
    description: 'Find the value that occurs most often in the input.',
    starterCode: `//! Find the value that occurs most often in the input.

use std::collections::HashMap;

pub fn most_common(numbers: &[i32]) -> i32 {
    let mut occurrences: HashMap<i32, i32> = HashMap::new();
    for &x in numbers {
        *occurrences.entry(x).or_insert(0) += 1;
    }

    let mut best: (i32, i32) = (
        *occurrences.iter().next().expect("empty input").0,
        *occurrences.iter().next().expect("empty input").1,
    );
    for (&value, &count) in &occurrences {
        if count > best.1 {
            best = (value, count);
        }
    }
    best.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_mode() {
        assert_eq!(most_common(&[4, 23, 10, -1, 10, 10, 4]), 10);
    }

    #[test]
    fn single_element() {
        assert_eq!(most_common(&[7]), 7);
    }

    #[test]
    fn all_distinct_returns_some_element() {
        let input = [1, 2, 3, 4];
        assert!(input.contains(&most_common(&input)));
    }
}`,
    solutionCode: `//! Find the value that occurs most often in the input.
//!
//! Solution: Use fold for a more functional approach.

use std::collections::HashMap;

pub fn most_common(numbers: &[i32]) -> i32 {
    let mut occurrences: HashMap<i32, i32> = HashMap::new();
    for &x in numbers {
        *occurrences.entry(x).or_insert(0) += 1;
    }

    *occurrences
        .iter()
        .max_by_key(|(_, &count)| count)
        .expect("empty input")
        .0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_mode() {
        assert_eq!(most_common(&[4, 23, 10, -1, 10, 10, 4]), 10);
    }

    #[test]
    fn single_element() {
        assert_eq!(most_common(&[7]), 7);
    }

    #[test]
    fn all_distinct_returns_some_element() {
        let input = [1, 2, 3, 4];
        assert!(input.contains(&most_common(&input)));
    }
}`
  },
  {
    id: 17,
    slug: 'trim_log_line',
    title: 'Trim log line',
    description: 'Clean up a log line by trimming whitespace, collapsing runs of internal whitespace, and removing a leading tag.',
    starterCode: `//! Clean up a log line by trimming whitespace, collapsing runs of
//! internal whitespace, and removing a leading \`[INFO]\`, \`[WARN]\`, or
//! \`[ERROR]\` tag.

pub fn trim_log_line(line: &str) -> String {
    let mut s = String::new();
    let mut started = false;
    for c in line.chars() {
        if !started && c.is_whitespace() {
            continue;
        }
        started = true;
        s.push(c);
    }
    while s.ends_with(' ') || s.ends_with('\\t') || s.ends_with('\\n') {
        s.pop();
    }

    for tag in &["[INFO]", "[WARN]", "[ERROR]"] {
        if s.starts_with(tag) {
            s = s[tag.len()..].to_string();
            if s.starts_with(' ') {
                s = s[1..].to_string();
            }
            break;
        }
    }

    let collapsed = s.replace("\\t", " ").replace("\\n", " ");
    let mut out = String::new();
    let mut prev_space = false;
    for c in collapsed.chars() {
        if c == ' ' {
            if !prev_space {
                out.push(' ');
            }
            prev_space = true;
        } else {
            out.push(c);
            prev_space = false;
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn strips_info_tag() {
        assert_eq!(trim_log_line("[INFO] hello world"), "hello world");
    }

    #[test]
    fn collapses_internal_whitespace() {
        assert_eq!(trim_log_line("a   b\\t\\tc"), "a b c");
    }

    #[test]
    fn trims_outer_whitespace() {
        assert_eq!(trim_log_line("   hi   "), "hi");
    }

    #[test]
    fn keeps_line_without_tag() {
        assert_eq!(trim_log_line("plain message"), "plain message");
    }
}`,
    solutionCode: `//! Clean up a log line by trimming whitespace, collapsing runs of
//! internal whitespace, and removing a leading tag.
//!
//! Solution: Use split_whitespace for simpler whitespace handling.

pub fn trim_log_line(line: &str) -> String {
    let mut s = line.trim().to_string();

    for tag in &["[INFO]", "[WARN]", "[ERROR]"] {
        if let Some(rest) = s.strip_prefix(tag) {
            s = rest.trim_start().to_string();
            break;
        }
    }

    s.split_whitespace().collect::<Vec<&str>>().join(" ")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn strips_info_tag() {
        assert_eq!(trim_log_line("[INFO] hello world"), "hello world");
    }

    #[test]
    fn collapses_internal_whitespace() {
        assert_eq!(trim_log_line("a   b\\t\\tc"), "a b c");
    }

    #[test]
    fn trims_outer_whitespace() {
        assert_eq!(trim_log_line("   hi   "), "hi");
    }

    #[test]
    fn keeps_line_without_tag() {
        assert_eq!(trim_log_line("plain message"), "plain message");
    }
}`
  },
  {
    id: 18,
    slug: 'parse_srt_timestamp',
    title: 'Parse SRT timestamp',
    description: 'Parse an SRT timestamp like "00:01:23,456" into a `Duration`.',
    starterCode: `//! Parse an SRT timestamp like "00:01:23,456" into a \`Duration\`.

use core::time::Duration;

pub fn parse_srt_timestamp(s: &str) -> Option<Duration> {
    let parts: Vec<&str> = s.split(':').collect();
    if parts.len() != 3 {
        return None;
    }

    let hours = parts[0].parse::<u64>().unwrap();
    let minutes = parts[1].parse::<u64>().unwrap();

    let sec_ms: Vec<&str> = parts[2].split(',').collect();
    if sec_ms.len() != 2 {
        return None;
    }
    let seconds = sec_ms[0].parse::<u64>().unwrap();
    let millis = sec_ms[1].parse::<u64>().unwrap();

    let total_ms = hours * 3_600_000 + minutes * 60_000 + seconds * 1_000 + millis;
    Some(Duration::from_millis(total_ms))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero() {
        assert_eq!(parse_srt_timestamp("00:00:00,000"), Some(Duration::ZERO));
    }

    #[test]
    fn one_minute_twentythree_seconds() {
        assert_eq!(
            parse_srt_timestamp("00:01:23,456"),
            Some(Duration::from_millis(83_456))
        );
    }

    #[test]
    fn wrong_separator_returns_none() {
        assert_eq!(parse_srt_timestamp("00:01:23.456"), None);
    }
}`,
    solutionCode: `//! Parse an SRT timestamp like "00:01:23,456" into a \`Duration\`.
//!
//! Solution: Use split_once for cleaner parsing.

use core::time::Duration;

pub fn parse_srt_timestamp(s: &str) -> Option<Duration> {
    let (time, millis_str) = s.split_once(',')?;
    let (hours_str, rest) = time.split_once(':')?;
    let (minutes_str, seconds_str) = rest.split_once(':')?;

    let hours = hours_str.parse::<u64>().ok()?;
    let minutes = minutes_str.parse::<u64>().ok()?;
    let seconds = seconds_str.parse::<u64>().ok()?;
    let millis = millis_str.parse::<u64>().ok()?;

    let total_ms = hours * 3_600_000 + minutes * 60_000 + seconds * 1_000 + millis;
    Some(Duration::from_millis(total_ms))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero() {
        assert_eq!(parse_srt_timestamp("00:00:00,000"), Some(Duration::ZERO));
    }

    #[test]
    fn one_minute_twentythree_seconds() {
        assert_eq!(
            parse_srt_timestamp("00:01:23,456"),
            Some(Duration::from_millis(83_456))
        );
    }

    #[test]
    fn wrong_separator_returns_none() {
        assert_eq!(parse_srt_timestamp("00:01:23.456"), None);
    }
}`
  },
  {
    id: 19,
    slug: 'iterators',
    title: 'Iterators',
    description: 'Generate the Fibonacci sequence. This works, but make it nicer.',
    starterCode: `//! Generate the Fibonacci sequence.
//!
//! This works, but make it nicer.
//! (Don't worry about the signature; you have free rein to change that code)

pub fn fib(n: u32) -> u64 {
    if n == 0 {
        return 0;
    }
    if n == 1 {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
}

pub fn first_n(n: usize) -> Vec<u64> {
    let mut result = Vec::new();
    let mut i = 0;
    while i < n {
        result.push(fib(i as u32));
        i = i + 1;
    }
    return result;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_ten() {
        let fib: Vec<u64> = first_n(10);
        assert_eq!(fib, vec![0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    }

    #[test]
    fn single_values() {
        assert_eq!(fib(0), 0);
        assert_eq!(fib(1), 1);
        assert_eq!(fib(10), 55);
    }
}`,
    solutionCode: `//! Generate the Fibonacci sequence.
//!
//! Solution: Use an iterator for a more idiomatic approach.

pub fn fibonacci() -> impl Iterator<Item = u64> {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    std::iter::from_fn(move || {
        let result = a;
        let next = a + b;
        a = b;
        b = next;
        Some(result)
    })
}

pub fn first_n(n: usize) -> Vec<u64> {
    fibonacci().take(n).collect()
}

pub fn fib(n: u32) -> u64 {
    fibonacci().nth(n as usize).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_ten() {
        let fib: Vec<u64> = first_n(10);
        assert_eq!(fib, vec![0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    }

    #[test]
    fn single_values() {
        assert_eq!(fib(0), 0);
        assert_eq!(fib(1), 1);
        assert_eq!(fib(10), 55);
    }
}`
  },
  {
    id: 20,
    slug: 'transformer',
    title: 'Transformer',
    description: 'Apply a sequence of `Command`s to strings.',
    starterCode: `//! Apply a sequence of \`Command\`s to strings.

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Command {
    Uppercase,
    Trim,
    Append(usize),
}

pub fn apply_commands(input: Vec<(String, Command)>) -> Vec<String> {
    let mut result = Vec::new();
    for i in 0..input.len() {
        let item = input[i].clone();
        let s = item.0;
        let c = item.1;

        if let Command::Uppercase = c {
            result.push(s.to_uppercase());
        } else if let Command::Trim = c {
            result.push(s.trim().to_string());
        } else if let Command::Append(n) = c {
            let mut temp_string = s;
            for _ in 0..n {
                temp_string.push_str("bar");
            }
            result.push(temp_string);
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Vec<(String, Command)> {
        vec![
            ("hello".to_string(), Command::Uppercase),
            (" all roads lead to rome! ".to_string(), Command::Trim),
            ("foo".to_string(), Command::Append(1)),
            ("bar".to_string(), Command::Append(5)),
        ]
    }

    #[test]
    fn applies_each_command() {
        let expected = vec![
            "HELLO",
            "all roads lead to rome!",
            "foobar",
            "barbarbarbarbarbar",
        ];
        assert_eq!(apply_commands(sample()), expected);
    }

    #[test]
    fn empty_input_yields_empty_output() {
        assert!(apply_commands(vec![]).is_empty());
    }

    #[test]
    fn append_zero_is_a_noop() {
        let out = apply_commands(vec![("x".into(), Command::Append(0))]);
        assert_eq!(out, vec!["x".to_string()]);
    }
}`,
    solutionCode: `//! Apply a sequence of \`Command\`s to strings.
//!
//! Solution: Use match for cleaner pattern matching.

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Command {
    Uppercase,
    Trim,
    Append(usize),
}

pub fn apply_commands(input: Vec<(String, Command)>) -> Vec<String> {
    input
        .into_iter()
        .map(|(s, cmd)| match cmd {
            Command::Uppercase => s.to_uppercase(),
            Command::Trim => s.trim().to_string(),
            Command::Append(n) => format!("{}{}", s, "bar".repeat(n)),
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Vec<(String, Command)> {
        vec![
            ("hello".to_string(), Command::Uppercase),
            (" all roads lead to rome! ".to_string(), Command::Trim),
            ("foo".to_string(), Command::Append(1)),
            ("bar".to_string(), Command::Append(5)),
        ]
    }

    #[test]
    fn applies_each_command() {
        let expected = vec![
            "HELLO",
            "all roads lead to rome!",
            "foobar",
            "barbarbarbarbarbar",
        ];
        assert_eq!(apply_commands(sample()), expected);
    }

    #[test]
    fn empty_input_yields_empty_output() {
        assert!(apply_commands(vec![]).is_empty());
    }

    #[test]
    fn append_zero_is_a_noop() {
        let out = apply_commands(vec![("x".into(), Command::Append(0))]);
        assert_eq!(out, vec!["x".to_string()]);
    }
}`
  },
  {
    id: 21,
    slug: 'fun_strings_ext',
    title: 'Fun strings ext',
    description: 'A bunch of little string helpers. Notice how call sites read inside-out.',
    starterCode: `//! A bunch of little string helpers. Notice how call sites read
//! inside-out: \`sparkle(&shout(s.trim()))\`.

pub fn shout(s: &str) -> String {
    s.to_uppercase()
}

pub fn sparkle(s: &str) -> String {
    format!("✨ {} ✨", s)
}

pub fn spongebob_case(s: &str) -> String {
    let mut out = String::new();
    for (i, c) in s.chars().enumerate() {
        if i % 2 == 0 {
            out.extend(c.to_uppercase());
        } else {
            out.extend(c.to_lowercase());
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shouts() {
        assert_eq!(shout("hi"), "HI");
    }

    #[test]
    fn sparkles() {
        assert_eq!(sparkle("x"), "✨ x ✨");
    }

    #[test]
    fn spongebob_cases() {
        assert_eq!(spongebob_case("spongebob"), "SpOnGeBoB");
    }

    #[test]
    fn composes_inside_out() {
        assert_eq!(sparkle(&shout("  hi  ".trim())), "✨ HI ✨");
    }
}`,
    solutionCode: `//! A bunch of little string helpers.
//!
//! Solution: Use enumerate for cleaner indexing.

pub fn shout(s: &str) -> String {
    s.to_uppercase()
}

pub fn sparkle(s: &str) -> String {
    format!("✨ {} ✨", s)
}

pub fn spongebob_case(s: &str) -> String {
    s.chars()
        .enumerate()
        .map(|(i, c)| {
            if i % 2 == 0 {
                c.to_uppercase().to_string()
            } else {
                c.to_lowercase().to_string()
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shouts() {
        assert_eq!(shout("hi"), "HI");
    }

    #[test]
    fn sparkles() {
        assert_eq!(sparkle("x"), "✨ x ✨");
    }

    #[test]
    fn spongebob_cases() {
        assert_eq!(spongebob_case("spongebob"), "SpOnGeBoB");
    }

    #[test]
    fn composes_inside_out() {
        assert_eq!(sparkle(&shout("  hi  ".trim())), "✨ HI ✨");
    }
}`
  },
  {
    id: 22,
    slug: 'quicksort',
    title: 'Quicksort',
    description: 'Sort a slice of integers with quicksort. Rewrite it so it reads the way you\'d explain quicksort on a whiteboard.',
    starterCode: `//! Sort a slice of integers with quicksort.
//!
//! This version works, but it's a mouthful: it copies into a \`Vec\`,
//! then juggles indices through a hand-written Lomuto partition with a
//! mutating helper. The algorithm is in there somewhere, buried under
//! bookkeeping. Rewrite it so it reads the way you'd explain quicksort
//! on a whiteboard. (You have free rein to change the signature.)

pub fn quicksort(input: &[i32]) -> Vec<i32> {
    let mut values = input.to_vec();
    let len = values.len();
    if len > 1 {
        sort_range(&mut values, 0, len - 1);
    }
    values
}

fn sort_range(values: &mut [i32], lo: usize, hi: usize) {
    if lo >= hi {
        return;
    }
    let pivot = values[hi];
    let mut i = lo;
    let mut j = lo;
    while j < hi {
        if values[j] <= pivot {
            values.swap(i, j);
            i += 1;
        }
        j += 1;
    }
    values.swap(i, hi);
    if i > 0 {
        sort_range(values, lo, i - 1);
    }
    sort_range(values, i + 1, hi);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sorts_a_typical_slice() {
        assert_eq!(
            quicksort(&[3, 1, 4, 1, 5, 9, 2, 6]),
            vec![1, 1, 2, 3, 4, 5, 6, 9]
        );
    }

    #[test]
    fn empty_and_single() {
        assert_eq!(quicksort(&[]), Vec::<i32>::new());
        assert_eq!(quicksort(&[42]), vec![42]);
    }

    #[test]
    fn already_sorted_and_reversed() {
        assert_eq!(quicksort(&[1, 2, 3]), vec![1, 2, 3]);
        assert_eq!(quicksort(&[3, 2, 1]), vec![1, 2, 3]);
    }

    #[test]
    fn duplicates_and_negatives() {
        assert_eq!(quicksort(&[5, -1, 5, 0, -1]), vec![-1, -1, 0, 5, 5]);
    }
}`,
    solutionCode: `//! Sort a slice of integers with quicksort.
//!
//! Solution: Use a more readable recursive approach with partitioning.

pub fn quicksort(input: &[i32]) -> Vec<i32> {
    if input.len() <= 1 {
        return input.to_vec();
    }

    let pivot = input[0];
    let less: Vec<i32> = input[1..].iter().copied().filter(|&x| x < pivot).collect();
    let equal: Vec<i32> = input.iter().copied().filter(|&x| x == pivot).collect();
    let greater: Vec<i32> = input[1..].iter().copied().filter(|&x| x > pivot).collect();

    let mut result = quicksort(&less);
    result.extend(equal);
    result.extend(quicksort(&greater));
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sorts_a_typical_slice() {
        assert_eq!(
            quicksort(&[3, 1, 4, 1, 5, 9, 2, 6]),
            vec![1, 1, 2, 3, 4, 5, 6, 9]
        );
    }

    #[test]
    fn empty_and_single() {
        assert_eq!(quicksort(&[]), Vec::<i32>::new());
        assert_eq!(quicksort(&[42]), vec![42]);
    }

    #[test]
    fn already_sorted_and_reversed() {
        assert_eq!(quicksort(&[1, 2, 3]), vec![1, 2, 3]);
        assert_eq!(quicksort(&[3, 2, 1]), vec![1, 2, 3]);
    }

    #[test]
    fn duplicates_and_negatives() {
        assert_eq!(quicksort(&[5, -1, 5, 0, -1]), vec![-1, -1, 0, 5, 5]);
    }
}`
  },
  {
    id: 23,
    slug: 'iban_prefix_check',
    title: 'IBAN prefix check',
    description: 'Validate that a string looks like an IBAN.',
    starterCode: `//! Validate that a string looks like an IBAN.
//!
//! Rules:
//! - First two characters: ASCII letters (country code).
//! - Next two characters: ASCII digits (check digits).
//! - Remaining characters: ASCII alphanumerics.
//! - Total length must match the expected length for the country.

pub fn is_valid_iban(s: &str) -> bool {
    let chars: Vec<char> = s.chars().collect();
    if chars.len() < 4 {
        return false;
    }

    let country = &s[0..2];

    if !chars[0].is_ascii_alphabetic() || !chars[1].is_ascii_alphabetic() {
        return false;
    }
    if !chars[2].is_ascii_digit() || !chars[3].is_ascii_digit() {
        return false;
    }
    for i in 4..chars.len() {
        if !chars[i].is_ascii_alphanumeric() {
            return false;
        }
    }

    let expected = if country == "DE" {
        22
    } else if country == "GB" {
        22
    } else if country == "FR" {
        27
    } else if country == "CH" {
        21
    } else if country == "NL" {
        18
    } else if country == "AT" {
        20
    } else {
        return false;
    };

    chars.len() == expected
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_de() {
        assert!(is_valid_iban("DE89370400440532013000"));
    }

    #[test]
    fn valid_nl() {
        assert!(is_valid_iban("NL91ABNA0417164300"));
    }

    #[test]
    fn wrong_length_for_country() {
        assert!(!is_valid_iban("DE8937040044053201"));
    }

    #[test]
    fn unknown_country() {
        assert!(!is_valid_iban("ZZ89370400440532013000"));
    }

    #[test]
    fn non_digits_in_check() {
        assert!(!is_valid_iban("DEAB370400440532013000"));
    }
}`,
    solutionCode: `//! Validate that a string looks like an IBAN.
//!
//! Solution: Use a HashMap for country lengths and pattern matching.

use std::collections::HashMap;

pub fn is_valid_iban(s: &str) -> bool {
    let country_lengths: HashMap<&str, usize> = [
        ("DE", 22), ("GB", 22), ("FR", 27),
        ("CH", 21), ("NL", 18), ("AT", 20),
    ].into();

    let bytes = s.as_bytes();
    if bytes.len() < 4 {
        return false;
    }

    if !bytes[0].is_ascii_alphabetic() || !bytes[1].is_ascii_alphabetic() {
        return false;
    }
    if !bytes[2].is_ascii_digit() || !bytes[3].is_ascii_digit() {
        return false;
    }
    if !bytes[4..].iter().all(|b| b.is_ascii_alphanumeric()) {
        return false;
    }

    let country = &s[0..2];
    match country_lengths.get(country) {
        Some(&expected) => bytes.len() == expected,
        None => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_de() {
        assert!(is_valid_iban("DE89370400440532013000"));
    }

    #[test]
    fn valid_nl() {
        assert!(is_valid_iban("NL91ABNA0417164300"));
    }

    #[test]
    fn wrong_length_for_country() {
        assert!(!is_valid_iban("DE8937040044053201"));
    }

    #[test]
    fn unknown_country() {
        assert!(!is_valid_iban("ZZ89370400440532013000"));
    }

    #[test]
    fn non_digits_in_check() {
        assert!(!is_valid_iban("DEAB370400440532013000"));
    }
}`
  },
  {
    id: 24,
    slug: 'http_response_router',
    title: 'HTTP response router',
    description: 'Decide what to do with an HTTP response based on its status code.',
    starterCode: `//! Decide what to do with an HTTP response based on its status code.

pub struct Response {
    pub status: u16,
    pub body: Vec<u8>,
}

pub enum Action {
    Ok(String),
    Retry,
    Fail(String),
}

pub fn handle_response(resp: Response) -> Action {
    if resp.status >= 100 && resp.status < 200 {
        println!("informational: {}", resp.status);
        return Action::Retry;
    } else if resp.status >= 200 && resp.status < 300 {
        let body = match String::from_utf8(resp.body) {
            Ok(s) => s,
            Err(_) => return Action::Fail("invalid utf-8".to_string()),
        };
        if resp.status == 204 {
            return Action::Ok(String::new());
        }
        println!("success: {}", resp.status);
        return Action::Ok(body);
    } else if resp.status >= 300 && resp.status < 400 {
        println!("redirect: {}", resp.status);
        return Action::Fail(format!("unhandled redirect {}", resp.status));
    } else if resp.status >= 400 && resp.status < 500 {
        if resp.status == 408 || resp.status == 429 {
            println!("client error, retrying: {}", resp.status);
            return Action::Retry;
        }
        println!("client error: {}", resp.status);
        return Action::Fail(format!("client error {}", resp.status));
    } else if resp.status >= 500 && resp.status < 600 {
        println!("server error, retrying: {}", resp.status);
        return Action::Retry;
    } else {
        println!("unknown status: {}", resp.status);
        return Action::Fail(format!("unknown status {}", resp.status));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ok_returns_body() {
        let r = Response {
            status: 200,
            body: b"hi".to_vec(),
        };
        assert!(matches!(handle_response(r), Action::Ok(s) if s == "hi"));
    }

    #[test]
    fn server_error_retries() {
        let r = Response {
            status: 503,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Retry));
    }

    #[test]
    fn rate_limited_retries() {
        let r = Response {
            status: 429,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Retry));
    }

    #[test]
    fn not_found_fails() {
        let r = Response {
            status: 404,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Fail(_)));
    }
}`,
    solutionCode: `//! Decide what to do with an HTTP response based on its status code.
//!
//! Solution: Use match with range patterns for cleaner pattern matching.

pub struct Response {
    pub status: u16,
    pub body: Vec<u8>,
}

pub enum Action {
    Ok(String),
    Retry,
    Fail(String),
}

pub fn handle_response(resp: Response) -> Action {
    match resp.status {
        100..=199 => Action::Retry,
        200..=299 => {
            if resp.status == 204 {
                return Action::Ok(String::new());
            }
            match String::from_utf8(resp.body) {
                Ok(body) => Action::Ok(body),
                Err(_) => Action::Fail("invalid utf-8".to_string()),
            }
        }
        300..=399 => Action::Fail(format!("unhandled redirect {}", resp.status)),
        408 | 429 => Action::Retry,
        400..=499 => Action::Fail(format!("client error {}", resp.status)),
        500..=599 => Action::Retry,
        _ => Action::Fail(format!("unknown status {}", resp.status)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ok_returns_body() {
        let r = Response {
            status: 200,
            body: b"hi".to_vec(),
        };
        assert!(matches!(handle_response(r), Action::Ok(s) if s == "hi"));
    }

    #[test]
    fn server_error_retries() {
        let r = Response {
            status: 503,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Retry));
    }

    #[test]
    fn rate_limited_retries() {
        let r = Response {
            status: 429,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Retry));
    }

    #[test]
    fn not_found_fails() {
        let r = Response {
            status: 404,
            body: vec![],
        };
        assert!(matches!(handle_response(r), Action::Fail(_)));
    }
}`
  },
  {
    id: 25,
    slug: 'config_loader',
    title: 'Config loader',
    description: 'Read configuration values out of a `HashMap<String, String>`.',
    starterCode: `//! Read configuration values out of a \`HashMap<String, String>\`.

use std::collections::HashMap;

pub fn get_port(config: &HashMap<String, String>) -> u16 {
    config
        .get("PORT")
        .unwrap_or(&"8080".to_string())
        .parse()
        .unwrap_or(8080)
}

pub fn get_host(config: &HashMap<String, String>) -> String {
    config
        .get("HOST")
        .unwrap_or(&"localhost".to_string())
        .clone()
}

pub fn get_debug(config: &HashMap<String, String>) -> bool {
    match config.get("DEBUG") {
        Some(v) => v == "1" || v == "true" || v == "yes",
        None => false,
    }
}

pub fn get_max_connections(config: &HashMap<String, String>) -> u32 {
    config
        .get("MAX_CONNECTIONS")
        .unwrap_or(&"100".to_string())
        .parse()
        .unwrap_or(100)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cfg(pairs: &[(&str, &str)]) -> HashMap<String, String> {
        pairs
            .iter()
            .map(|(k, v)| ((*k).to_string(), (*v).to_string()))
            .collect()
    }

    #[test]
    fn defaults_when_missing() {
        let c = cfg(&[]);
        assert_eq!(get_port(&c), 8080);
        assert_eq!(get_host(&c), "localhost");
        assert!(!get_debug(&c));
    }

    #[test]
    fn invalid_value_silently_defaults() {
        let c = cfg(&[("PORT", "banana")]);
        assert_eq!(get_port(&c), 8080);
    }

    #[test]
    fn debug_truthy_values() {
        assert!(get_debug(&cfg(&[("DEBUG", "1")])));
        assert!(get_debug(&cfg(&[("DEBUG", "true")])));
        assert!(!get_debug(&cfg(&[("DEBUG", "no")])));
    }
}`,
    solutionCode: `//! Read configuration values out of a \`HashMap<String, String>\`.
//!
//! Solution: Use a generic helper function to reduce repetition.

use std::collections::HashMap;

fn get_config_value<T: std::str::FromStr>(
    config: &HashMap<String, String>,
    key: &str,
    default: T,
) -> T {
    config
        .get(key)
        .and_then(|v| v.parse().ok())
        .unwrap_or(default)
}

pub fn get_port(config: &HashMap<String, String>) -> u16 {
    get_config_value(config, "PORT", 8080)
}

pub fn get_host(config: &HashMap<String, String>) -> String {
    get_config_value(config, "HOST", "localhost".to_string())
}

pub fn get_debug(config: &HashMap<String, String>) -> bool {
    config
        .get("DEBUG")
        .is_some_and(|v| v == "1" || v == "true" || v == "yes")
}

pub fn get_max_connections(config: &HashMap<String, String>) -> u32 {
    get_config_value(config, "MAX_CONNECTIONS", 100)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cfg(pairs: &[(&str, &str)]) -> HashMap<String, String> {
        pairs
            .iter()
            .map(|(k, v)| ((*k).to_string(), (*v).to_string()))
            .collect()
    }

    #[test]
    fn defaults_when_missing() {
        let c = cfg(&[]);
        assert_eq!(get_port(&c), 8080);
        assert_eq!(get_host(&c), "localhost");
        assert!(!get_debug(&c));
    }

    #[test]
    fn invalid_value_silently_defaults() {
        let c = cfg(&[("PORT", "banana")]);
        assert_eq!(get_port(&c), 8080);
    }

    #[test]
    fn debug_truthy_values() {
        assert!(get_debug(&cfg(&[("DEBUG", "1")])));
        assert!(get_debug(&cfg(&[("DEBUG", "true")])));
        assert!(!get_debug(&cfg(&[("DEBUG", "no")])));
    }
}`
  },
  {
    id: 26,
    slug: 'env_file_parser',
    title: 'Env file parser',
    description: 'Parse a `.env` file into key/value pairs.',
    starterCode: `//! Parse a \`.env\` file into key/value pairs.
//!
//! Supports \`KEY=value\` lines, blank lines, and \`#\` comments. Quoted
//! values get their surrounding double quotes stripped.
//!
//! The starter handles the easy lines and silently mangles the rest:
//! values containing \`=\`, quoted values containing \`#\`, escape
//! sequences, and multi-line quoted values. There is no error type at
//! all, so callers can't tell a parse failure from a missing key.

use std::collections::HashMap;

pub fn parse_env(content: &str) -> HashMap<String, String> {
    let mut result = HashMap::new();
    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        if trimmed.starts_with('#') {
            continue;
        }
        // Strip inline comments too. Naive, but "good enough".
        let without_comment = match trimmed.find('#') {
            Some(i) => &trimmed[..i],
            None => trimmed,
        };
        let parts: Vec<&str> = without_comment.split('=').collect();
        if parts.len() != 2 {
            continue;
        }
        let key = parts[0].trim().to_string();
        let mut value = parts[1].trim().to_string();
        if value.starts_with('"') && value.ends_with('"') && value.len() >= 2 {
            value = value[1..value.len() - 1].to_string();
        }
        result.insert(key, value);
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(input: &str) -> HashMap<String, String> {
        parse_env(input)
    }

    #[test]
    fn simple_key_value() {
        let env = parse("KEY=value");
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn skips_blank_lines_and_comments() {
        let input = "\
# a comment
\\nKEY=value
";
        let env = parse(input);
        assert_eq!(env.len(), 1);
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn strips_surrounding_double_quotes() {
        let env = parse(r#"GREETING="hello world""#);
        assert_eq!(env.get("GREETING").map(String::as_str), Some("hello world"));
    }

    #[test]
    fn trims_surrounding_whitespace() {
        let env = parse("  KEY = value  ");
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn empty_value_is_allowed() {
        let env = parse("EMPTY=");
        assert_eq!(env.get("EMPTY").map(String::as_str), Some(""));
    }
}`,
    solutionCode: `//! Parse a \`.env\` file into key/value pairs.
//!
//! Solution: Use split_once for cleaner key-value parsing.

use std::collections::HashMap;

pub fn parse_env(content: &str) -> HashMap<String, String> {
    content
        .lines()
        .filter_map(|line| {
            let trimmed = line.trim();
            if trimmed.is_empty() || trimmed.starts_with('#') {
                return None;
            }
            let without_comment = trimmed.split_once('#').map_or(trimmed, |(before, _)| before);
            let (key, value) = without_comment.split_once('=')?;
            let key = key.trim().to_string();
            let value = value.trim().trim_matches('"').to_string();
            Some((key, value))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(input: &str) -> HashMap<String, String> {
        parse_env(input)
    }

    #[test]
    fn simple_key_value() {
        let env = parse("KEY=value");
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn skips_blank_lines_and_comments() {
        let input = "\
# a comment
\\nKEY=value
";
        let env = parse(input);
        assert_eq!(env.len(), 1);
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn strips_surrounding_double_quotes() {
        let env = parse(r#"GREETING="hello world""#);
        assert_eq!(env.get("GREETING").map(String::as_str), Some("hello world"));
    }

    #[test]
    fn trims_surrounding_whitespace() {
        let env = parse("  KEY = value  ");
        assert_eq!(env.get("KEY").map(String::as_str), Some("value"));
    }

    #[test]
    fn empty_value_is_allowed() {
        let env = parse("EMPTY=");
        assert_eq!(env.get("EMPTY").map(String::as_str), Some(""));
    }
}`
  },
  {
    id: 27,
    slug: 'mini_redis',
    title: 'Mini Redis',
    description: 'A tiny in-memory key/value store, Redis-flavored.',
    starterCode: `//! A tiny in-memory key/value store, Redis-flavored.
//!
//! Three commands: \`SET key value\`, \`LPUSH key value [value ...]\`, and
//! \`HSET key field value\`. One command per data type.
//!
//! The lesson is the *shape* of \`handle\`, not the command list.

use std::collections::HashMap;

#[derive(Default)]
pub struct Db {
    pub strings: HashMap<String, String>,
    pub lists: HashMap<String, Vec<String>>,
    pub hashes: HashMap<String, HashMap<String, String>>,
}

pub fn handle(db: &mut Db, args: &[&str]) -> String {
    if args.is_empty() {
        return "-ERR empty command\\r\\n".to_string();
    }
    let cmd = args[0].to_uppercase();
    if cmd == "SET" {
        if args.len() < 3 {
            return "-ERR wrong number of arguments\\r\\n".to_string();
        }
        let key = args[1].to_string();
        let value = args[2].to_string();
        db.strings.insert(key, value);
        return "+OK\\r\\n".to_string();
    } else if cmd == "LPUSH" {
        assert!(args.len() >= 3, "LPUSH needs key and at least one value");
        let key = args[1].to_string();
        let list = db.lists.entry(key).or_insert_with(Vec::new);
        for v in &args[2..] {
            list.insert(0, v.to_string());
        }
        return format!(":{}\\r\\n", list.len());
    } else if cmd == "HSET" {
        let key = args[1].to_string();
        let field = args[2].to_string();
        let value = args[3].to_string();
        let hash = db.hashes.entry(key).or_insert_with(HashMap::new);
        let is_new = !hash.contains_key(&field);
        hash.insert(field, value);
        return format!(":{}\\r\\n", if is_new { 1 } else { 0 });
    } else {
        return format!("-ERR unknown command '{}'\\r\\n", args[0]);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_writes_to_strings() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["SET", "x", "1"]), "+OK\\r\\n");
        assert_eq!(db.strings.get("x"), Some(&"1".to_string()));
    }

    #[test]
    fn lpush_writes_to_lists_in_reverse_order() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["LPUSH", "q", "a", "b"]), ":2\\r\\n");
        assert_eq!(
            db.lists.get("q").unwrap(),
            &vec!["b".to_string(), "a".to_string()]
        );
    }

    #[test]
    fn hset_writes_to_hashes() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["HSET", "u", "name", "ada"]), ":1\\r\\n");
        assert_eq!(
            db.hashes.get("u").unwrap().get("name"),
            Some(&"ada".to_string())
        );
    }

    #[test]
    fn hset_returns_zero_on_field_update() {
        let mut db = Db::default();
        handle(&mut db, &["HSET", "u", "name", "ada"]);
        assert_eq!(handle(&mut db, &["HSET", "u", "name", "grace"]), ":0\\r\\n");
    }

    #[test]
    fn unknown_command_returns_error() {
        let mut db = Db::default();
        let reply = handle(&mut db, &["FROBNICATE", "x"]);
        assert!(reply.starts_with("-ERR"));
    }
}`,
    solutionCode: `//! A tiny in-memory key/value store, Redis-flavored.
//!
//! Solution: Use an enum and match for cleaner command routing.

use std::collections::HashMap;

#[derive(Default)]
pub struct Db {
    pub strings: HashMap<String, String>,
    pub lists: HashMap<String, Vec<String>>,
    pub hashes: HashMap<String, HashMap<String, String>>,
}

enum Command {
    Set(String, String),
    Lpush(String, Vec<String>),
    Hset(String, String, String),
    Unknown(String),
}

fn parse_command(args: &[&str]) -> Command {
    match args {
        ["SET", key, value] => Command::Set(key.to_string(), value.to_string()),
        ["LPUSH", key, values @ ..] if !values.is_empty() => {
            Command::Lpush(key.to_string(), values.iter().map(|s| s.to_string()).collect())
        }
        ["HSET", key, field, value] => {
            Command::Hset(key.to_string(), field.to_string(), value.to_string())
        }
        [cmd, ..] => Command::Unknown(cmd.to_string()),
        [] => Command::Unknown(String::new()),
    }
}

pub fn handle(db: &mut Db, args: &[&str]) -> String {
    match parse_command(args) {
        Command::Set(key, value) => {
            db.strings.insert(key, value);
            "+OK\\r\\n".to_string()
        }
        Command::Lpush(key, values) => {
            let list = db.lists.entry(key).or_default();
            for v in values.into_iter().rev() {
                list.insert(0, v);
            }
            format!(":{}\\r\\n", list.len())
        }
        Command::Hset(key, field, value) => {
            let hash = db.hashes.entry(key).or_default();
            let is_new = hash.insert(field, value).is_none();
            format!(":{}\\r\\n", if is_new { 1 } else { 0 })
        }
        Command::Unknown(cmd) => format!("-ERR unknown command '{}'\\r\\n", cmd),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn set_writes_to_strings() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["SET", "x", "1"]), "+OK\\r\\n");
        assert_eq!(db.strings.get("x"), Some(&"1".to_string()));
    }

    #[test]
    fn lpush_writes_to_lists_in_reverse_order() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["LPUSH", "q", "a", "b"]), ":2\\r\\n");
        assert_eq!(
            db.lists.get("q").unwrap(),
            &vec!["b".to_string(), "a".to_string()]
        );
    }

    #[test]
    fn hset_writes_to_hashes() {
        let mut db = Db::default();
        assert_eq!(handle(&mut db, &["HSET", "u", "name", "ada"]), ":1\\r\\n");
        assert_eq!(
            db.hashes.get("u").unwrap().get("name"),
            Some(&"ada".to_string())
        );
    }

    #[test]
    fn hset_returns_zero_on_field_update() {
        let mut db = Db::default();
        handle(&mut db, &["HSET", "u", "name", "ada"]);
        assert_eq!(handle(&mut db, &["HSET", "u", "name", "grace"]), ":0\\r\\n");
    }

    #[test]
    fn unknown_command_returns_error() {
        let mut db = Db::default();
        let reply = handle(&mut db, &["FROBNICATE", "x"]);
        assert!(reply.starts_with("-ERR"));
    }
}`
  }
]

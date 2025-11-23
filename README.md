![GitHub repo size](https://img.shields.io/github/repo-size/0Password/0password.github.io)
![GitHub License](https://img.shields.io/github/license/0Password/0password.github.io)
![GitHub Created At](https://img.shields.io/github/created-at/0Password/0password.github.io)
![GitHub forks](https://img.shields.io/github/forks/0Password/0password.github.io)
![GitHub Repo stars](https://img.shields.io/github/stars/0Password/0password.github.io)

# 0Password - [https://0password.github.io](https://0password.github.io)

Deterministic password generator. Master key + service name → unique password. Nothing stored, nothing remembered.

![Alt text](https://0password.github.io/media/0Password.jpg)

## How it works

1. Enter master key (keep it safe)
2. Enter service name (e.g., "reddit", "github")
3. Set options (length, character types)
4. Generate password

Same inputs = same password, every time.

## Features

- SHA-256 based generation
- Customizable length and character sets
- No ambiguous characters (0/O, 1/l/I)
- Printable for offline storage
- Nothing stored anywhere

## Why deterministic?

Traditional password managers store encrypted passwords. This doesn't. You can regenerate any password anytime, anywhere, as long as you remember your master key.

## Contributing

Fork, improve, PR.

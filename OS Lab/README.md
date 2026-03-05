# Linux Shell in C - Custom Shell Implementation

A simple Unix shell implementation in C that provides a command-line interface for interacting with the operating system.

## 🚀 Overview

The custom shell supports several core features and commands commonly found in standard Unix shells:
- **Built-in Commands**: `cd`, `pwd`, `exit`, etc.
- **External Commands**: Execution of standard Unix utilities like `ls`, `cp`, `rm`, `mv`, and more.
- **Advanced Features**:
  - **Piping**: Chaining multiple commands using the `|` operator.
  - **Background Execution**: Running commands in the background using the `&` operator.
  - **Input/Output Redirection**: Support for standard input and output redirection.

## 🛠️ Tech Stack

- **Language**: C
- **API**: POSIX Systems API (fork, exec, wait, pipe, etc.)

## 📂 Project Structure

- `shell.c`: The core shell implementation including parsing, command execution, and built-in commands.
- `manual.c`: A manual or guide file for users to understand how to interact with the shell.

## ⚙️ Setup and Installation

### 1. Prerequisites
- GCC (GNU Compiler Collection) or any other C compiler.
- A Unix-like operating system (Linux, macOS, etc.).

### 2. Compilation
To compile the shell:
```bash
gcc shell.c -o custom_shell
```

## 🏃 How to Run

To start the custom shell:
```bash
./custom_shell
```

To run the manual:
```bash
gcc manual.c -o manual
./manual
```

## 📖 Usage Examples

### Standard Command
```bash
ls -l
```

### Piping
```bash
ls | grep ".c"
```

### Background Execution
```bash
sleep 10 &
```

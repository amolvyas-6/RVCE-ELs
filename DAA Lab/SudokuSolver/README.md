
# Sudoku Solver and Generator

## Overview
This is an C++ Sudoku Solver and Generator application built with Qt, demonstrating backtracking algorithm and GUI development.

## Features
- Generate random Sudoku puzzles
- Solve Sudoku puzzles with step-by-step visualization
- Demonstrates backtracking algorithm

## Build Instructions

### Using CMake (Recommended)
1. Clone the repository
2. Create a build directory:
   ```bash
   mkdir build
   cd build
   ```
3. Generate build files:
   ```bash
   cmake ..
   ```
4. Build the project:
   ```bash
   cmake --build .
   ```

### Using Qt Creator
1. Open the CMakeLists.txt file in Qt Creator
2. Configure the project
3. Build and Run

## Algorithm Explanation
The solver uses a backtracking algorithm to solve Sudoku puzzles:
1. Find an empty cell
2. Try numbers 1-9
3. Check if the number is valid
4. If valid, recursively solve the rest of the grid
5. If no solution found, backtrack and try next number


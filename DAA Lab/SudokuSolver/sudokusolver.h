
#ifndef SUDOKUSOLVER_H
#define SUDOKUSOLVER_H

#include <vector>
#include <random>
#include <algorithm>
#include <set>

class SudokuSolver {
public:
    // 9x9 Sudoku grid type
    using SudokuGrid = std::vector<std::vector<int>>;

    // Generate a fully solved Sudoku grid
    static SudokuGrid generateSolvedGrid();

    // Generate a Sudoku puzzle with unique solution
    static SudokuGrid generatePuzzle(int difficulty = 40);

    // Solve the Sudoku puzzle using backtracking
    static bool solveSudoku(SudokuGrid& grid);

    // Helper methods made public for demonstration
    static bool isSafe(const SudokuGrid& grid, int row, int col, int num);
    static bool findEmptyCell(const SudokuGrid& grid, int& row, int& col);

private:
    // Generate a random, valid number for a cell
    static int generateRandomValidNumber(const SudokuGrid& grid, int row, int col);
};

#endif // SUDOKUSOLVER_H

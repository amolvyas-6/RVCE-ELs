
#include "sudokusolver.h"

bool SudokuSolver::isSafe(const SudokuGrid &grid, int row, int col, int num)
{
    // Check row
    for (int x = 0; x < 9; x++)
    {
        if (grid[row][x] == num)
            return false;
    }

    // Check column
    for (int x = 0; x < 9; x++)
    {
        if (grid[x][col] == num)
            return false;
    }

    // Check 3x3 box
    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            if (grid[i + startRow][j + startCol] == num)
                return false;
        }
    }

    return true;
}

bool SudokuSolver::findEmptyCell(const SudokuGrid &grid, int &row, int &col)
{
    for (row = 0; row < 9; row++)
    {
        for (col = 0; col < 9; col++)
        {
            if (grid[row][col] == 0)
                return true;
        }
    }
    return false;
}

bool SudokuSolver::solveSudoku(SudokuGrid &grid)
{
    int row, col;

    if (!findEmptyCell(grid, row, col))
    {
        return true;
    }

    // Try placing numbers 1-9
    for (int num = 1; num <= 9; num++)
    {
        if (isSafe(grid, row, col, num))
        {
            // Tentatively place the number
            grid[row][col] = num;

            // Recursively try to solve rest of the grid
            if (solveSudoku(grid))
            {
                return true;
            }

            // If placing number doesn't lead to solution, backtrack
            grid[row][col] = 0;
        }
    }

    // Trigger backtracking
    return false;
}

int SudokuSolver::generateRandomValidNumber(const SudokuGrid &grid, int row, int col)
{
    std::vector<int> validNumbers;
    for (int num = 1; num <= 9; num++)
    {
        if (isSafe(grid, row, col, num))
        {
            validNumbers.push_back(num);
        }
    }

    if (validNumbers.empty())
        return 0;

    // Use random number generator to select a number
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, validNumbers.size() - 1);
    return validNumbers[dis(gen)];
}

SudokuSolver::SudokuGrid SudokuSolver::generateSolvedGrid()
{
    SudokuGrid grid(9, std::vector<int>(9, 0));

    // Seed with some initial numbers in first few cells
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, 9);

    // Pre-fill some cells to reduce generation time
    for (int i = 0; i < 10; i++)
    {
        int row = dis(gen) - 1;
        int col = dis(gen) - 1;
        int num = dis(gen);

        if (isSafe(grid, row, col, num))
        {
            grid[row][col] = num;
        }
    }

    // Solve the grid
    solveSudoku(grid);
    return grid;
}

SudokuSolver::SudokuGrid SudokuSolver::generatePuzzle(int difficulty)
{
    // Start with a solved grid
    SudokuGrid puzzle = generateSolvedGrid();

    // Remove numbers to create puzzle
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 8);
    difficulty = 47;
    int cellsRemoved = 0;
    while (cellsRemoved < difficulty)
    {
        int row = dis(gen);
        int col = dis(gen);

        if (puzzle[row][col] != 0)
        {
            int backup = puzzle[row][col];
            puzzle[row][col] = 0;

            // Ensure unique solution
            SudokuGrid testGrid = puzzle;
            int solutions = 0;

            // Count solutions
            auto countSolutions = [&](auto &self, SudokuGrid &grid) -> void
            {
                int row, col;
                if (!findEmptyCell(grid, row, col))
                {
                    solutions++;
                    return;
                }

                for (int num = 1; num <= 9; num++)
                {
                    if (isSafe(grid, row, col, num))
                    {
                        grid[row][col] = num;
                        self(self, grid);
                        grid[row][col] = 0;

                        // Limit to 2 solutions to keep checking efficient
                        if (solutions > 1)
                            return;
                    }
                }
            };

            countSolutions(countSolutions, testGrid);

            // If more than one solution, restore the number
            if (solutions != 1)
            {
                puzzle[row][col] = backup;
            }
            else
            {
                cellsRemoved++;
            }
        }
    }

    return puzzle;
}

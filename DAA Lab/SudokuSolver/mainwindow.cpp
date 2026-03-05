
#include "mainwindow.h"
#include <QVBoxLayout>
#include <QFont>
#include <QApplication>
#include <QRegularExpression>   
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent) {
    // Set up central widget and main layout
    QWidget* centralWidget = new QWidget(this);
    QVBoxLayout* mainLayout = new QVBoxLayout(centralWidget);

    // Create Sudoku grid
    setupSudokuGrid();

    // Add grid to main layout
    QGridLayout* gridLayout = new QGridLayout();
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            gridLayout->addWidget(sudokuCells[i][j], i, j);

            // Add visual separators for 3x3 boxes
            if (i % 3 == 0 && i > 0) gridLayout->setRowMinimumHeight(i, 5);
            if (j % 3 == 0 && j > 0) gridLayout->setColumnMinimumWidth(j, 5);
        }
    }
    mainLayout->addLayout(gridLayout);

    // Create buttons
    QHBoxLayout* buttonLayout = new QHBoxLayout();
    generateButton = new QPushButton("Generate Sudoku", this);
    solveButton = new QPushButton("Solve Sudoku", this);

    buttonLayout->addWidget(generateButton);
    buttonLayout->addWidget(solveButton);
    mainLayout->addLayout(buttonLayout);

    // Steps label
    stepsLabel = new QLabel("Sudoku Solver Simulation", this);
    stepsLabel->setWordWrap(true);
    mainLayout->addWidget(stepsLabel);

    // Connect buttons to slots
    connect(generateButton, &QPushButton::clicked, this, &MainWindow::generateSudoku);
    connect(solveButton, &QPushButton::clicked, this, &MainWindow::solveSudoku);

    // Set central widget
    setCentralWidget(centralWidget);
    setWindowTitle("Sudoku Solver");
    resize(500, 400);
}

void MainWindow::setupSudokuGrid() {
    // Initialize 9x9 grid of line edits
    sudokuCells.resize(9);
    for (int i = 0; i < 9; i++) {
        sudokuCells[i].resize(9);
        for (int j = 0; j < 9; j++) {
            QLineEdit* cell = new QLineEdit(this);
            cell->setMaxLength(1);
            cell->setAlignment(Qt::AlignCenter);

            // Set font and size
            QFont font = cell->font();
            font.setPointSize(16);
            cell->setFont(font);

            // Restrict input to numbers 1-9
            cell->setValidator(new QIntValidator(1, 9, this));

            sudokuCells[i][j] = cell;
        }
    }
}

void MainWindow::updateSudokuGrid(const SudokuSolver::SudokuGrid& grid) {
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            QString style = sudokuCells[i][j]->styleSheet();

            if (currentPuzzle[i][j] != 0) {
                // Fixed original number in green
                sudokuCells[i][j]->setText(QString::number(currentPuzzle[i][j]));
                sudokuCells[i][j]->setReadOnly(true);

                // Replace or add color green to existing style
                style.replace(QRegularExpression("color:[^;]*;"), "color: green;");
                if (!style.contains("color:")) {
                    style += "color: green;";
                }
                sudokuCells[i][j]->setStyleSheet(style);
            } else if (grid[i][j] != 0) {
                // Tentative solving number in red
                sudokuCells[i][j]->setText(QString::number(grid[i][j]));
                sudokuCells[i][j]->setReadOnly(true);

                style.replace(QRegularExpression("color:[^;]*;"), "color: red;");
                if (!style.contains("color:")) {
                    style += "color: red;";
                }
                sudokuCells[i][j]->setStyleSheet(style);
            } else {
                sudokuCells[i][j]->clear();
                sudokuCells[i][j]->setReadOnly(true);

                style.replace(QRegularExpression("color:[^;]*;"), "color: black;");
                if (!style.contains("color:")) {
                    style += "color: black;";
                }
                sudokuCells[i][j]->setStyleSheet(style);
            }
        }
    }
}

void MainWindow::generateSudoku() {
    // Generate a new Sudoku puzzle
    currentPuzzle = SudokuSolver::generatePuzzle();
    updateSudokuGrid(currentPuzzle);

    // Reset steps label
    stepsLabel->clear();
}

void MainWindow::solveSudoku() {
    // Copy current grid state
    SudokuSolver::SudokuGrid solveGrid = currentPuzzle;

    
    QString steps;

    // Override solving to show steps
    auto solveSudokuWithSteps = [&](auto& self, SudokuSolver::SudokuGrid& grid) -> bool {
        int row, col;

        // If no empty cell found, puzzle is solved
        if (!SudokuSolver::findEmptyCell(grid, row, col)) {
            steps += "All cells filled. Puzzle solved!\n";
            return true;
        }

        // Try placing numbers 1-9
        for (int num = 1; num <= 9; num++) {
            // Check if number can be placed safely
            if (SudokuSolver::isSafe(grid, row, col, num)) {
              

                
                grid[row][col] = num;

                // Update UI to show current state
                updateSudokuGrid(grid);
                qApp->processEvents(); 
                QThread::msleep(50);  

                
                if (self(self, grid)) {
                    return true;
                }

                

                grid[row][col] = 0;

                // Update UI to show backtracking
                updateSudokuGrid(grid);
                qApp->processEvents(); 
                QThread::msleep(50);  
            }
        }

        // Trigger backtracking
        return false;
    };

    // Solve the grid with visualization
    if (solveSudokuWithSteps(solveSudokuWithSteps, solveGrid)) {
        // Show steps in label
        stepsLabel->setText(steps);

        // Update grid with solved state
        updateSudokuGrid(solveGrid);
    } else {
        QMessageBox::warning(this, "Solve Failed", "Unable to solve this Sudoku!");
    }
}

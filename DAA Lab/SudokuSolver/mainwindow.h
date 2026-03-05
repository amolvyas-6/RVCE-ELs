
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QGridLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QLabel>
#include <QVector>
#include <QThread>
#include <QIntValidator>
#include "sudokusolver.h"

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);

private:
    // 9x9 grid of line edits to represent Sudoku board
    QVector<QVector<QLineEdit*>> sudokuCells;
    
    // Buttons for generating and solving
    QPushButton* generateButton;
    QPushButton* solveButton;
    
    // Label to show solving steps
    QLabel* stepsLabel;

    // Current puzzle grid
    SudokuSolver::SudokuGrid currentPuzzle;

    // Setup the Sudoku grid UI
    void setupSudokuGrid();
    
    // Update UI with current puzzle
    void updateSudokuGrid(const SudokuSolver::SudokuGrid& grid);

private slots:
    // Generate a new Sudoku puzzle
    void generateSudoku();
    
    // Solve the current Sudoku puzzle
    void solveSudoku();
};

#endif // MAINWINDOW_H

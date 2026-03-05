cmake_minimum_required(VERSION 3.10)
project(SudokuSolver VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set Qt6 installation path (update this path to your Qt installation)
set(CMAKE_PREFIX_PATH "C:/Qt/6.9.0/mingw_64/lib/cmake" ${CMAKE_PREFIX_PATH})

# Enable automoc, autorcc, autouic before find_package
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Find Qt6 Widgets component
find_package(Qt6 COMPONENTS Widgets REQUIRED)

# Add executable
add_executable(SudokuSolver
    main.cpp
    mainwindow.cpp
    sudokusolver.cpp
)

# Link Qt6 Widgets library
target_link_libraries(SudokuSolver PRIVATE
    Qt6::Widgets
)

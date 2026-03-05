# Orbital Mechanics & Planet Distance Simulator

A Python-based tool for exploring orbital mechanics, calculating interplanetary distances, and planning launch windows.

## 🚀 Overview

This project provides a comprehensive simulator for:
- **Distance Calculations**: Real-time and historical average/least distance between any two planets (Mercury, Venus, Earth, Mars).
- **Launch Window Analysis**: Planning the next optimal launch date for a mission to Mars based on orbital distance.
- **Closest Approach Tracking**: Calculating the next date of closest approach between two specific planets.
- **Visualization**: Plotting interactive graphs for distance trends and closest approach intervals.

## 🛠️ Tech Stack

- **Data Handling**: Pandas, Numpy
- **Visualization**: Matplotlib
- **DateTime Analysis**: Python Standard Library (datetime, date)

## 📂 Project Structure

- `theoryEL.py`: Main interactive simulation script with orbital calculations and plotting logic.
- `createDB.py`: Script for managing planetary data.
- `Planet Distances.csv`: Dataset containing historical distance data for calculation and visualization.

## ⚙️ Setup and Installation

### 1. Prerequisites
- Python 3.8+
- Pandas, Numpy, and Matplotlib libraries.

### 2. Install Dependencies
```bash
pip install pandas numpy matplotlib
```

## 🏃 How to Run

To start the simulator:
```bash
python theoryEL.py
```

## 📖 Usage Examples

1. **Option 1**: Calculate distances between planets and view historical trends.
2. **Option 2**: Find the next launch window for a mission to Mars.
3. **Option 3**: Predict the next date of closest approach between any two planets.

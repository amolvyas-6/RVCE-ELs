# GestureX - Gesture-Based Control System

An AI-powered system for controlling your computer through hand gestures, using advanced computer vision and machine learning models.

## 🚀 Overview

GestureX uses real-time hand tracking and gesture recognition to perform system-level actions, making it an intuitive interface for tasks like:
- **ASL Recognition**: American Sign Language translation.
- **Volume & Brightness Control**: Hand distance-based adjustments.
- **Mouse Control**: Cursor movement and clicking via hand tracking.
- **Custom Gestures**: Training and recognizing user-defined gestures.

## 🛠️ Tech Stack

- **Computer Vision**: OpenCV, Mediapipe
- **Deep Learning**: TensorFlow, Keras
- **System Control**: PyAutoGUI, Pycaw (for audio), screen_brightness_control
- **Data Handling**: Numpy, Pandas
- **GUI**: CustomTkinter, TkinterVideo
- **Visualization**: Matplotlib

## 📂 Project Structure

- `code/`: Main implementation logic (ASL, hand tracking, system controls).
- `models/`: Pre-trained H5 models for gesture and ASL recognition.
- `data/`: CSV files for gesture and sign data.
- `training code/`: Jupyter notebooks for training the underlying models.
- `mainProg.py`: Entry point for the GestureX application.

## ⚙️ Setup and Installation

### 1. Prerequisites
- Python 3.9+
- A webcam for hand tracking.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

## 🏃 How to Run

To start the GestureX application:
```bash
python code/mainProg.py
```

To run individual modules (e.g., ASL Recognition):
```bash
python code/ASL.py
```

## 📊 Model Information
- `ASL_model.h5`: Trained to recognize the American Sign Language alphabet.
- `gesture_model.h5`: Trained for custom gesture recognition tasks.
- Models are built using TensorFlow/Keras and optimized for real-time inference.

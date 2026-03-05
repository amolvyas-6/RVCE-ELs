# AIML Lab - Audio Deepfake Detection

This project focuses on detecting synthetic or manipulated audio (deepfakes) using advanced deep learning architectures. It implements two primary models: LFCC-LCNN and Audio Transformers.

## 🚀 Overview

The laboratory work explores:
- **LFCC-LCNN**: Linear Frequency Cepstral Coefficients combined with Light Convolutional Neural Networks.
- **Transformers**: Applying self-attention mechanisms to audio features for robust classification.

## 🛠️ Tech Stack

- **Language**: Python 3.11+
- **Deep Learning**: PyTorch, Torchaudio
- **Audio Processing**: Librosa, Soundfile
- **Data Handling**: Numpy, Pandas
- **Visualization**: Matplotlib
- **Package Manager**: [uv](https://docs.astral.sh/uv/)

## 📂 Project Structure

- `LFCC_LCNN/`: Implementation of the LCNN-based detection model.
- `Transformer/`: Implementation of the Transformer-based detection model.
- `audio_dataset.py`: Custom PyTorch Dataset for loading and preprocessing audio files.
- `model.py`: Model architecture definitions.
- `train.py`: Training script with logging and checkpointing.
- `inference.py`: Script for running predictions on new audio samples.
- `test.ipynb`: Jupyter notebook for experimentation and evaluation.

## ⚙️ Setup and Installation

1. **Install uv** (if not already installed):
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Sync dependencies**:
   ```bash
   uv sync
   ```

3. **Activate environment**:
   ```bash
   source .venv/bin/activate
   ```

## 🏃 How to Run

### Training
To train the LFCC-LCNN model:
```bash
uv run python LFCC_LCNN/train.py
```

To train the Transformer model:
```bash
uv run python Transformer/train.py
```

### Inference
To run inference on an audio file:
```bash
uv run python LFCC_LCNN/inference.py --input path/to/audio.wav
```

## 📊 Evaluation
Detailed performance metrics and analysis can be found in the `Report.pdf` and the `test.ipynb` notebook.

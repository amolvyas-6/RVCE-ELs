from dataclasses import dataclass, field

import numpy as np
import torch
import torchaudio
import torchaudio.transforms as T
from torch.utils.data import Dataset
from tqdm import tqdm


@dataclass
class Config:
    # Dataset Related:
    sr: int = 16000
    chunk_length: int = 2
    chunk_overlap: int = 1
    n_lfcc: int = 60
    n_fft: int = 512
    hop_length: int = 160

    idx2class: dict[int, str] = field(
        default_factory=lambda: {0: "bonafide", 1: "spoof"}
    )
    class2idx: dict[str, int] = field(
        default_factory=lambda: {"bonafide": 0, "spoof": 1}
    )

    # Model Related:
    d_model: int = 512
    max_len: int = 512  # Only being used in positional encoding
    dropout: float = 0.3
    nhead: int = 4  # num heads in attention
    dim_ff: int = 2 * d_model
    activation: str = "gelu"
    num_layers: int = 3  # num of encoder layers
    num_classes: int = 2

    # Dataloader Related:
    batch_size: int = 32
    num_workers: int = 8
    pin_memory: bool = True

    # Training Related:
    num_epochs: int = 5
    learning_rate: float = 1e-4
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    save_path: str = "./checkpoints"
    logs_path: str = "./logs"

    # Scheduler Related:
    scheduler_patience: int = 2
    scheduler_factor: float = 0.5
    min_lr: float = 1e-6

    # Misc
    seed: int = 42


class AudioDataset(Dataset):
    def __init__(self, audio_list, config) -> None:
        super().__init__()
        self.data = audio_list
        self.sr = config.sr
        self.chunk_length = config.chunk_length
        self.chunk_overlap = config.chunk_overlap
        self.class2idx = config.class2idx

        self.lfcc = T.LFCC(
            sample_rate=self.sr,
            n_lfcc=config.n_lfcc,
            speckwargs={"n_fft": config.n_fft, "hop_length": config.hop_length},
        )

        self.chunk_index = []
        self._build_chunk_index()

    def _build_chunk_index(self):
        chunk_samples = int(self.chunk_length * self.sr)
        overlap_samples = int(self.chunk_overlap * self.sr)
        step_samples = chunk_samples - overlap_samples

        for file_idx in tqdm(range(len(self.data))):
            file_path, label = self.data[file_idx]
            label = self.class2idx[label]

            # Load audio
            audio, sr = torchaudio.load(file_path)
            if sr != self.sr:
                resampler = torchaudio.transforms.Resample(sr, self.sr)
                audio = resampler(audio)
            audio = audio.squeeze().numpy()
            total_samples = len(audio)

            # Create overlapping chunks
            start_sample = 0
            while start_sample + chunk_samples <= total_samples:
                self.chunk_index.append((file_path, label, start_sample))
                start_sample += step_samples

            # Will pad it later
            if start_sample < total_samples:
                self.chunk_index.append((file_path, label, start_sample))

    def _extract_chunk(self, audio_path, start_sample):
        audio, sr = torchaudio.load(audio_path)
        if sr != self.sr:
            resampler = torchaudio.transforms.Resample(sr, self.sr)
            audio = resampler(audio)
        audio = audio.squeeze().numpy()

        end_sample = start_sample + int(self.chunk_length * self.sr)
        chunk = audio[start_sample:end_sample]
        if len(chunk) < (end_sample - start_sample):
            pad_width = end_sample - start_sample - len(chunk)
            chunk = np.pad(chunk, (0, pad_width), mode="constant")
        return chunk

    def __len__(self):
        return len(self.chunk_index)

    def __getitem__(self, idx):
        file_path, label, start_sample = self.chunk_index[idx]
        chunk = self._extract_chunk(file_path, start_sample)

        chunk_tensor = torch.tensor(chunk, dtype=torch.float32)
        label_tensor = torch.tensor(label, dtype=torch.float32)

        # Reshape to (time_dim, n_lfcc)
        chunk_lfcc = self.lfcc(chunk_tensor).transpose(1, 0).clone()
        return chunk_lfcc, label_tensor

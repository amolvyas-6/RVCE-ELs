from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from audio_dataset import AudioDataset, Config
from logger import setup_logger
from model import LCNN
from sklearn.metrics import roc_curve
from torch.utils.data import DataLoader
from tqdm import tqdm

config = Config()
torch.manual_seed(config.seed)
logger = setup_logger("train", log_file=f"{config.logs_path}/training.log")


def add_from_file(filename, arr, audio_files_base_path):
    with open(filename, "r") as f:
        lines = f.readlines()
        for line in lines:
            words = line.strip().split()
            audio_filename = words[1] + ".flac"
            label = words[-1]
            full_path = audio_files_base_path / audio_filename
            arr.append((str(full_path), label))
    return arr


# Dataset Preparation
train = []
eval = []
train = add_from_file(
    Path("../PA/ASVspoof2019_PA_cm_protocols/ASVspoof2019.PA.cm.train.trn2.txt"),
    train,
    Path("../PA/ASVspoof2019_PA_train/flac"),
)
eval = add_from_file(
    Path("../PA/ASVspoof2019_PA_cm_protocols/ASVspoof2019.PA.cm.dev.trl2.txt"),
    eval,
    Path("../PA/ASVspoof2019_PA_dev/flac"),
)

train_dataset = AudioDataset(audio_list=train, config=config)
eval_dataset = AudioDataset(audio_list=eval, config=config)
logger.info(
    f"Number of Training samples: {len(train_dataset)} | "
    f"Number of Evaluation samples: {len(eval_dataset)}"
)


train_dataloader = DataLoader(
    train_dataset,
    batch_size=config.batch_size,
    num_workers=config.num_workers,
    pin_memory=config.pin_memory,
    shuffle=True,
)
eval_dataloader = DataLoader(
    eval_dataset,
    batch_size=config.batch_size,
    num_workers=config.num_workers,
    pin_memory=config.pin_memory,
    shuffle=False,
)

# Model Setup
model = LCNN(
    sample_rate=config.sr,
    n_lfcc=config.n_lfcc,
    n_fft=config.n_fft,
    hop_length=config.hop_length,
).to(config.device)
logger.info(f"Using device: {config.device}")

criterion = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(
    model.parameters(), lr=config.learning_rate, weight_decay=config.weight_decay
)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="min",
    factor=config.scheduler_factor,
    patience=config.scheduler_patience,
    min_lr=config.min_lr,
)


# Metrics:
def compute_accuracy(predictions, targets):
    correct = (predictions == targets).sum()
    total = len(targets)
    accuracy = 100 * correct / total
    return accuracy


def compute_eer(scores, targets):
    fpr, tpr, thresholds = roc_curve(targets, scores, pos_label=1)
    fnr = 1 - tpr
    # Find the threshold where FPR and FNR are closest (EER point)

    eer_idx = np.nanargmin(np.abs(fpr - fnr))
    eer = (fpr[eer_idx] + fnr[eer_idx]) / 2
    threshold = thresholds[eer_idx]

    return eer, threshold


# Training Loop:
best_eval_loss = float("inf")
save_epoch = 0
eval_loss_list = []
train_loss_list = []

for epoch in range(config.num_epochs):
    model.train()
    total_loss = 0.0
    for inputs, targets in tqdm(
        train_dataloader, desc=f"Epoch {epoch + 1}/{config.num_epochs}"
    ):
        inputs = inputs.to(config.device)
        targets = targets.to(config.device).long()

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    # Evaluation Loop:
    model.eval()
    all_predictions = []
    all_targets = []
    all_scores = []
    eval_loss = 0
    with torch.no_grad():
        for inputs, targets in tqdm(eval_dataloader, desc="Evaluating"):
            inputs = inputs.to(config.device)
            targets = targets.to(config.device).long()

            outputs = model(inputs)
            loss = criterion(outputs, targets)
            eval_loss += loss.item()

            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            # Probabilities of spoof class
            spoof_scores = probabilities[:, config.class2idx["spoof"]]
            _, predicted = torch.max(outputs, 1)

            all_predictions.extend(predicted.cpu().tolist())
            all_targets.extend(targets.cpu().tolist())
            all_scores.extend(spoof_scores.cpu().tolist())

    all_predictions = np.array(all_predictions)
    all_targets = np.array(all_targets)
    all_scores = np.array(all_scores)

    accuracy = compute_accuracy(all_predictions, all_targets)
    eer, eer_threshold = compute_eer(all_scores, all_targets)

    avg_loss = total_loss / len(train_dataloader)
    avg_eval_loss = eval_loss / len(eval_dataloader)
    current_lr = optimizer.param_groups[0]["lr"]

    logger.info(
        f"Epoch [{epoch + 1}/{config.num_epochs}] - "
        f"Train_Loss: {avg_loss:.4f}, Eval_Loss: {avg_eval_loss:.4f}, "
        f"Accuracy: {accuracy:.2f}%%, EER: {eer:.4f}, LR: {current_lr:.2e}"
    )
    eval_loss_list.append(avg_eval_loss)
    train_loss_list.append(avg_loss)

    scheduler.step(avg_eval_loss)
    if avg_eval_loss < best_eval_loss:
        best_eval_loss = avg_eval_loss
        torch.save(model.state_dict(), f"{config.save_path}/best_model.pth")
        logger.info(f"Best model saved with accuracy: {accuracy:.2f}%%")
        save_epoch = epoch + 1

num_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
logger.info(f"Model has {num_params} trainable parameters.")
plt.figure()
plt.plot(range(1, config.num_epochs + 1), train_loss_list, label="Train Loss")
plt.plot(range(1, config.num_epochs + 1), eval_loss_list, label="Eval Loss")
plt.axvline(x=save_epoch, color="r", linestyle="--", label="Best Model Epoch")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training and Evaluation Loss over Epochs")
plt.legend()
plt.savefig(f"{config.logs_path}/loss_curve.png")

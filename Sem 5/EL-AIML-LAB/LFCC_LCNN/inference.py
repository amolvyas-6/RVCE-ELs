from pathlib import Path

import numpy as np
import torch
from audio_dataset import AudioDataset, Config
from logger import setup_logger
from model import LCNN
from sklearn.metrics import roc_curve
from torch.utils.data import DataLoader
from tqdm import tqdm

config = Config()
logger = setup_logger("inference", log_file=f"{config.logs_path}/inference.log")


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


def run_inference(audio_list, model_path, config):
    dataset = AudioDataset(audio_list=audio_list, config=config)

    dataloader = DataLoader(
        dataset,
        batch_size=config.batch_size,
        num_workers=config.num_workers,
        shuffle=False,
    )

    # Load model
    model = LCNN(
        sample_rate=config.sr,
        n_lfcc=config.n_lfcc,
        n_fft=config.n_fft,
        hop_length=config.hop_length,
    ).to(config.device)
    if model_path:
        model.load_state_dict(torch.load(model_path, map_location=config.device))
        logger.info(f"Loaded model from {model_path}")
    model.eval()

    all_predictions = []
    all_targets = []
    all_scores = []
    with torch.no_grad():
        for inputs, targets in tqdm(dataloader, desc="Evaluating"):
            inputs = inputs.to(config.device)
            targets = targets.to(config.device).long()

            outputs = model(inputs)
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

    logger.info(f"Accuracy: {accuracy:.2f}%%, EER: {eer:.4f}")


if __name__ == "__main__":
    # Example usage
    audios_list = []
    with open(
        Path("../PA/ASVspoof2019_PA_cm_protocols/ASVspoof2019.PA.cm.eval.trl.txt"), "r"
    ) as f:
        lines = f.readlines()
        for line in lines:
            words = line.strip().split()
            audio_filename = words[1] + ".flac"
            label = words[-1]
            full_path = Path("../PA/ASVspoof2019_PA_eval/flac") / audio_filename
            audios_list.append((str(full_path), label))

    run_inference(
        audios_list, model_path=config.save_path + "/best_model.pth", config=config
    )

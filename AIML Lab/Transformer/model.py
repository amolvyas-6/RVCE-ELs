import math

import torch
import torch.nn as nn


class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len):
        super().__init__()

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()

        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )

        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)

        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x):
        time_dim = x.size(1)
        return x + self.pe[:, :time_dim]  # pyright: ignore[reportIndexIssue]


class AudioSpoofTransformer(nn.Module):
    def __init__(self, config) -> None:
        super().__init__()
        self.input_proj = nn.Linear(config.n_lfcc, config.d_model)
        self.dropout = nn.Dropout(config.dropout)
        self.pos_enc = PositionalEncoding(config.d_model, config.max_len)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=config.d_model,
            nhead=config.nhead,
            dim_feedforward=config.dim_ff,
            dropout=config.dropout,
            activation=config.activation,
            batch_first=True,
        )

        self.encoder = nn.TransformerEncoder(
            encoder_layer, num_layers=config.num_layers
        )

        self.classifier = nn.Linear(config.d_model, config.num_classes)

    def forward(self, x):
        x = self.input_proj(x)
        x = self.dropout(x)
        x = self.pos_enc(x)
        x = self.encoder(x)

        x = x.mean(dim=1)
        logits = self.classifier(x)
        return logits

import torch.nn as nn


class MaxFeatureMap2D(nn.Module):
    """Max feature map (along 2D)
    Reduces channels by half by taking max across channel pairs. (Default: dim=1)
    Input:  (batch, channels, height, width)
    Output: (batch, channels//2, height, width)
    """

    def __init__(self, max_dim=1):
        super(MaxFeatureMap2D, self).__init__()
        self.max_dim = max_dim

    def forward(self, inputs):
        shape = list(inputs.size())
        if self.max_dim >= len(shape):
            print("MaxFeatureMap: maximize on %d dim" % (self.max_dim))
            print("But input has %d dimensions" % (len(shape)))
            raise ValueError("Invalid max_dim for MaxFeatureMap")
        if shape[self.max_dim] // 2 * 2 != shape[self.max_dim]:
            print("MaxFeatureMap: maximize on %d dim" % (self.max_dim))
            print("But this dimension has an odd number of data")
            raise ValueError("Dimension to maximize must have even size")

        shape[self.max_dim] = shape[self.max_dim] // 2
        shape.insert(self.max_dim, 2)
        output = inputs.view(*shape).max(self.max_dim)[0]
        return output


class LCNN(nn.Module):
    def __init__(self, sample_rate, n_lfcc, n_fft, hop_length):
        super(LCNN, self).__init__()

        # Actual LCNN network
        self.network = nn.Sequential(
            nn.Conv2d(
                in_channels=1, out_channels=64, kernel_size=(5, 5), stride=1, padding=2
            ),
            MaxFeatureMap2D(max_dim=1),
            nn.MaxPool2d(kernel_size=(2, 2), stride=(2, 2)),
            nn.Conv2d(
                in_channels=32, out_channels=64, kernel_size=(1, 1), stride=1, padding=0
            ),
            MaxFeatureMap2D(max_dim=1),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(
                in_channels=32, out_channels=96, kernel_size=(3, 3), stride=1, padding=1
            ),
            MaxFeatureMap2D(max_dim=1),
            nn.MaxPool2d(kernel_size=(2, 2), stride=(2, 2)),
            nn.BatchNorm2d(48),
            nn.Conv2d(
                in_channels=48,
                out_channels=96,
                kernel_size=(1, 1),
                stride=1,
                padding=(0, 0),
            ),
            MaxFeatureMap2D(),
            nn.BatchNorm2d(num_features=48),
            nn.Conv2d(
                in_channels=48,
                out_channels=128,
                kernel_size=(3, 3),
                stride=1,
                padding=(1, 1),
            ),
            MaxFeatureMap2D(),
            nn.MaxPool2d(kernel_size=(2, 2), stride=(2, 2)),
            nn.Conv2d(
                in_channels=64,
                out_channels=128,
                kernel_size=(1, 1),
                stride=1,
                padding=(0, 0),
            ),
            MaxFeatureMap2D(),
            nn.BatchNorm2d(num_features=64),
            nn.Conv2d(
                in_channels=64,
                out_channels=64,
                kernel_size=(3, 3),
                stride=1,
                padding=(1, 1),
            ),
            MaxFeatureMap2D(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(
                in_channels=32,
                out_channels=64,
                kernel_size=(1, 1),
                stride=1,
                padding=(0, 0),
            ),
            MaxFeatureMap2D(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(
                in_channels=32,
                out_channels=64,
                kernel_size=(3, 3),
                stride=1,
                padding=(1, 1),
            ),
            MaxFeatureMap2D(),
            nn.MaxPool2d(kernel_size=(2, 2), stride=(2, 2)),
            nn.Dropout(0.8),
        )

        # Final fully connected layer for binary classification
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.LazyLinear(out_features=64),
            nn.ReLU(),
            nn.Dropout(0.7),
            nn.Linear(64, 2),
        )

    def forward(self, x):
        # CNN feature extraction
        x = self.network(x)
        x = self.fc(x)  # (batch, 1)

        return x

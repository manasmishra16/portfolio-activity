from fastapi import APIRouter, HTTPException
from typing import List, Optional

router = APIRouter()

NOTES = [
    {
        "slug": "cnn-lstm-clinical-signals",
        "title": "Architecting Hybrid CNN-LSTM Networks for Sequential Clinical Risk Prediction",
        "date": "August 2026",
        "readTime": "6 min read",
        "summary": "Deep dive into combining 1D temporal convolutional feature extractors with recurrent memory cells for high-accuracy cardiovascular risk classification.",
        "tags": ["Deep Learning", "TensorFlow", "CNN", "LSTM", "Healthcare AI"],
        "content": """
### 1. The Challenge of Sequential Clinical Data

Cardiovascular risk assessment from sequential patient physiological telemetry presents two distinct dimensional challenges:
1. Local morphological patterns (e.g. ST-segment elevation, QRS complex amplitude fluctuations).
2. Long-term temporal dependencies spanning multiple observation intervals.

Standard feedforward networks treat features as static vectors, forfeiting temporal sequence ordering. Conversely, pure Recurrent Neural Networks (RNNs) struggle with vanishing gradients when processing raw multi-lead feature streams.

### 2. Hybrid Convolutional-Recurrent Pipeline

To address these limitations, our architecture implements a two-stage sequential model:
- **Stage 1: 1D-CNN Spatial Extraction**: Conv1D filters with kernel size 3 and ReLU activation slide across the standardized clinical vectors, extracting local invariant physiological biomarkers. Batch normalization stabilizes feature distribution prior to MaxPooling.
- **Stage 2: Bidirectional LSTM Temporal Aggregation**: The compressed feature representation flows into a 64-unit Bidirectional LSTM layer, simultaneously analyzing forward and reverse sequential progression.
- **Stage 3: Dense Classification & Dropout**: A 0.35 dropout barrier protects against overfitting before a Sigmoid activation outputs calibrated cardiovascular risk probability.

```python
import tensorflow as tf
from tensorflow.keras import layers, models

def build_cnn_lstm_classifier(input_shape):
    model = models.Sequential([
        layers.Input(shape=input_shape),
        layers.Conv1D(filters=32, kernel_size=3, padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling1D(pool_size=2),
        layers.Bidirectional(layers.LSTM(64, return_sequences=False)),
        layers.Dropout(0.35),
        layers.Dense(32, activation='relu'),
        layers.Dense(1, activation='sigmoid')
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC(name='auc')]
    )
    return model
```

### 3. Empirical Results & Clinical Validation

On standardized clinical validation benchmarks:
- **Classification Accuracy**: 94.6%
- **Area Under ROC Curve (AUC-ROC)**: 0.962
- **Inference Latency**: ~12ms per patient record on standard CPU inference

The integration of 1D spatial filters reduced input sequence dimensionality by 50% prior to recurrent ingestion, speeding up convergence by 2.4x compared to vanilla LSTM baselines.
"""
    },
    {
        "slug": "automating-ml-pipelines-mangoml",
        "title": "Automating Feature Engineering & Model Selection in Agricultural Pathology (MangoML)",
        "date": "July 2026",
        "readTime": "5 min read",
        "summary": "Engineering a zero-configuration AutoML engine to detect foliar crop diseases with automated outlier pruning and ensemble ranking.",
        "tags": ["AutoML", "Scikit-Learn", "Feature Engineering", "Full-Stack"],
        "content": """
### 1. Domain Problem: Agricultural Diagnosis at the Edge

Foliar crop disease detection requires rapid, deterministic triage. In agricultural settings, data collection exhibits noisy visual variance, environmental lighting changes, and imbalanced symptom severity.

MangoML was engineered to automate the end-to-end journey from raw tabular and imagery metrics to production inference.

### 2. Automated Pipeline Design

```
Raw Agricultural Indicators
         │
         ▼
[ Robust Scaling & Outlier Clipping ]
         │
         ▼
[ Variance Threshold & Multi-Collinearity Filter ]
         │
         ▼
[ K-Fold Cross-Validated Model Tournament ]
  ├─ Random Forest
  ├─ Extra Trees Classifier
  ├─ Gradient Boosting
  └─ Logistic Regression (L2)
         │
         ▼
[ Calibrated Ensemble Voting Classifier ]
         │
         ▼
Production REST API / Web Application
```

### 3. Key Engineering Takeaways

- **Robust Scaler**: Traditional StandardScaler fails in the presence of extreme agricultural measurement outliers. Using median-centered RobustScaler improved downstream tree model stability by 14%.
- **Automated Hyperparameter Tournament**: MangoML conducts grid sweeps with early stopping across tree depth, min_samples_split, and learning rates.
- **Full-Stack Deployment**: Coupled with a high-speed TypeScript/React interface on Vercel, allowing field specialists to upload diagnostic telemetry and inspect confidence metrics in real time.
"""
    },
    {
        "slug": "zero-g-webgl-shaders-threejs",
        "title": "Achieving 60 FPS in Brutalist 3D Web Applications with React Three Fiber",
        "date": "June 2026",
        "readTime": "7 min read",
        "summary": "Technical techniques for zero-gravity physics, contact shadow optimization, and ACES Filmic tone mapping in modern React 19 web applications.",
        "tags": ["Three.js", "WebGL", "React 19", "Creative Tech", "Performance"],
        "content": """
### 1. High-Performance 3D Web Principles

Modern creative web experiences often suffer from sluggish frame rates and battery drain. In this portfolio, the objective was uncompromising: a zero-gravity spatial computing aesthetic with dynamic terminal rendering at a sustained 60 FPS across desktop and mobile devices.

### 2. Core Optimization Strategies

1. **Procedural Canvas Texturing**: Rather than loading external multi-megabyte 4K texture files, the laptop workstation screen is drawn to a 2048x1280 HTML canvas updated only when active, uploaded to the GPU via `THREE.CanvasTexture` with `toneMapped={false}`.
2. **ContactShadows vs Real-Time Cascaded Shadow Maps**: Cascaded shadow maps with high bias consume significant fill rate. By utilizing screen-space blurred ContactShadows beneath the floating workstation, we achieve soft ground contact occlusion at a fraction of the GPU draw calls.
3. **Geometry Pruning**: Restricting floating geometries strictly to the right hemisphere and culling off-screen mesh calculations.
4. **ACES Filmic Tone Mapping**: Configured `toneMappingExposure: 1.05` to deliver high dynamic range contrast with realistic metallic rim reflections.
"""
    }
]

@router.get("/")
def get_all_notes():
    return {"data": NOTES, "total": len(NOTES)}

@router.get("/{slug}")
def get_note_by_slug(slug: str):
    for note in NOTES:
        if note["slug"] == slug:
            return {"data": note}
    raise HTTPException(status_code=404, detail="Note not found")

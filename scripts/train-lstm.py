#!/usr/bin/env python3
"""
LSTM 로또 번호 예측 모델 학습 스크립트
- episodes.json에서 데이터 로드
- 슬라이딩 윈도우 방식으로 학습 데이터 구성
- LSTM 모델 학습 후 TensorFlow.js 형식으로 변환/저장

사용법:
  pip install tensorflow tensorflowjs
  python scripts/train-lstm.py
"""

import json
import numpy as np
import os

# ── 설정 ──
WINDOW_SIZE = 10       # 최근 N회 입력
NUM_BALLS = 45         # 1~45
EPOCHS = 100
BATCH_SIZE = 32
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'model', 'lstm')

def load_episodes():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'episodes.json')
    with open(data_path, 'r') as f:
        data = json.load(f)
    episodes = data['episodes']
    # 회차 순서대로 정렬
    episodes.sort(key=lambda x: x['ltEpsd'])
    return episodes

def episode_to_binary(ep):
    """에피소드를 45차원 이진 벡터로 변환"""
    vec = np.zeros(NUM_BALLS, dtype=np.float32)
    for key in ['tm1WnNo', 'tm2WnNo', 'tm3WnNo', 'tm4WnNo', 'tm5WnNo', 'tm6WnNo']:
        num = ep[key]
        vec[num - 1] = 1.0
    return vec

def prepare_data(episodes):
    """슬라이딩 윈도우로 X, Y 데이터 구성"""
    binaries = np.array([episode_to_binary(ep) for ep in episodes])

    X, Y = [], []
    for i in range(WINDOW_SIZE, len(binaries)):
        X.append(binaries[i - WINDOW_SIZE:i])  # [WINDOW_SIZE, 45]
        Y.append(binaries[i])                   # [45]

    return np.array(X), np.array(Y)

def build_model():
    import tensorflow as tf

    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(128, input_shape=(WINDOW_SIZE, NUM_BALLS), return_sequences=True),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.LSTM(64),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(NUM_BALLS, activation='sigmoid')
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    return model

def main():
    import tensorflow as tf

    print("📦 에피소드 데이터 로드 중...")
    episodes = load_episodes()
    print(f"   총 {len(episodes)}회차 로드 완료")

    print("🔧 학습 데이터 준비 중...")
    X, Y = prepare_data(episodes)
    print(f"   X shape: {X.shape}, Y shape: {Y.shape}")

    # 학습/검증 분할 (최근 100회를 검증용으로)
    split = -100
    X_train, X_val = X[:split], X[split:]
    Y_train, Y_val = Y[:split], Y[split:]

    print("🧠 LSTM 모델 구축 중...")
    model = build_model()
    model.summary()

    print("🏋️ 학습 시작...")
    history = model.fit(
        X_train, Y_train,
        validation_data=(X_val, Y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=0.0001
            )
        ]
    )

    # 검증 성능 출력
    val_loss = min(history.history['val_loss'])
    print(f"\n✅ 학습 완료! Best val_loss: {val_loss:.4f}")

    # TensorFlow.js 형식으로 저장
    os.makedirs(MODEL_DIR, exist_ok=True)

    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, MODEL_DIR)
    print(f"💾 모델 저장 완료: {MODEL_DIR}")

    # 메타데이터 저장
    meta = {
        'windowSize': WINDOW_SIZE,
        'numBalls': NUM_BALLS,
        'totalEpisodes': len(episodes),
        'trainedAt': episodes[-1]['ltEpsd'],
        'valLoss': float(val_loss),
    }
    with open(os.path.join(MODEL_DIR, 'meta.json'), 'w') as f:
        json.dump(meta, f, indent=2)
    print("📋 메타데이터 저장 완료")

if __name__ == '__main__':
    main()

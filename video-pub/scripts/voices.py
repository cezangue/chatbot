"""Génère les voix (TTS neuronal hors-ligne Piper via sherpa-onnx) et les manifestes.

Entrées : script/lines.json, modèles dans $TTS_DIR (vits-piper-fr_FR-*), photos dans public/cast/.
Sorties : public/voice/<id>.wav, src/voice.json (durée en images + enveloppe), src/cast.json.
"""
import json, os, re, sys, wave
import numpy as np
import sherpa_onnx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TTS_DIR = os.environ.get('TTS_DIR', os.path.join(ROOT, 'tts-models'))
FPS = 30
SR = 24000

# personnage -> (voix, locuteur, vitesse, hauteur)  (hauteur < 1 : voix plus grave)
CAST_VOICES = {
    'POSE': ('fr_FR-tom-medium', 0, 1.15, 1.0),
    'JEAN': ('fr_FR-upmc-medium', 1, 1.05, 1.12),
    'PAUL': ('fr_FR-upmc-medium', 1, 0.95, 0.98),
    'DIRECTEUR': ('fr_FR-upmc-medium', 1, 0.88, 0.84),
    'ESTHER': ('fr_FR-siwis-medium', 0, 1.05, 1.0),
    'COLLÈGUE': ('fr_FR-gilles-low', 0, 1.0, 1.0),
}

SPOKEN = [
    (r'PowerPoint', 'Paweur Pointe'),
    (r'Esther', 'Estère'),
    (r'WhatsApp', 'Ouatsap'),
    (r'Wow', 'Waouh'),
    (r'jury', 'jurie'),
    (r'’', "'"),
]


def spoken(text):
    for a, b in SPOKEN:
        text = re.sub(a, b, text)
    return text


_engines = {}


def engine(name):
    if name not in _engines:
        d = os.path.join(TTS_DIR, f'vits-piper-{name}')
        cfg = sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=os.path.join(d, f'{name}.onnx'),
                    tokens=os.path.join(d, 'tokens.txt'),
                    data_dir=os.path.join(d, 'espeak-ng-data'),
                ),
                num_threads=4,
            ),
        )
        _engines[name] = sherpa_onnx.OfflineTts(cfg)
    return _engines[name]


def resample(x, src, dst):
    n = int(round(len(x) * dst / src))
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)


def synth(who, text):
    model, sid, speed, pitch = CAST_VOICES[who]
    # Changement de hauteur par rééchantillonnage : on compense le tempo via la vitesse.
    a = engine(model).generate(spoken(text), sid=sid, speed=speed / pitch)
    x = np.array(a.samples, dtype=np.float32)
    x = resample(x, a.sample_rate * pitch, SR)
    # coupe des silences de début/fin, normalisation
    idx = np.where(np.abs(x) > 0.01)[0]
    if len(idx):
        x = x[max(0, idx[0] - 600): idx[-1] + 2400]
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    return x


def write_wav(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


def main():
    lines = json.load(open(os.path.join(ROOT, 'script/lines.json'), encoding='utf-8'))
    only = set(sys.argv[1:])
    meta_path = os.path.join(ROOT, 'src/voice.json')
    meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}
    for lid, (who, text) in lines.items():
        if only and lid not in only and lid in meta:
            continue
        x = synth(who, text)
        write_wav(os.path.join(ROOT, 'public/voice', f'{lid}.wav'), x)
        hop = SR // FPS
        env = [float(np.sqrt(np.mean(x[i:i + hop] ** 2))) for i in range(0, len(x), hop)]
        m = max(env) or 1
        meta[lid] = {'frames': int(np.ceil(len(x) / SR * FPS)), 'env': [round(e / m, 2) for e in env]}
        print(f'{lid:7s} {who:10s} {len(x) / SR:5.1f}s')
    json.dump(meta, open(meta_path, 'w'), separators=(',', ':'))

    cast = sorted(f for f in os.listdir(os.path.join(ROOT, 'public/cast')) if re.search(r'\.(png|jpe?g|webp)$', f, re.I))
    json.dump(cast, open(os.path.join(ROOT, 'src/cast.json'), 'w'), ensure_ascii=False, indent=1)
    total = sum(v['frames'] for k, v in meta.items() if k in lines)
    print('photos :', cast, '| voix totale :', round(total / FPS), 's')


if __name__ == '__main__':
    main()

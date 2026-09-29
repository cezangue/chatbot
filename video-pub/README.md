# Publicité vidéo — La Nouvelle Méthode PowerPoint

Vidéo Remotion (1920×1080, 30 i/s, ~4 min 40 s) : dialogues **parlés** (voix de synthèse) et sous-titres
synchronisés, vraies photos pour les personnages, et les « Bonhommes » **dans les diapositives de Paul**
(la démonstration de la méthode).

## Ajouter / remplacer les photos des personnages

Déposer les photos dans `public/cast/`, nommées d’après le personnage, puis relancer `npm run voices` (met à jour la liste) et `npm run render` :

| Fichier | Utilisé pour |
|---|---|
| `JEAN.jpg`, `JEAN-stress.png` | Jean (neutre / déçu) |
| `PAUL.jpg` | Paul |
| `DIRECTEUR.jpg` | le directeur |
| `ESTHER.jpg` | Esther |
| `POSE.jpg` | Pose, le narrateur |
| `SONIA.png` | Sonia |

Suffixe `-humeur` facultatif (ex. `PAUL-sourire.jpg`). Sans photo, une silhouette provisoire s’affiche.

## Fichiers

- `script/lines.json` : toutes les répliques (texte = sous-titre = voix).
- `src/story.tsx` : découpage des scènes et plans. `src/slides.tsx` : diapositives « Bonhomme ».
- `src/timeline.tsx` : calage automatique des plans sur la durée réelle des voix.
- `scripts/voices.py` : synthèse vocale hors-ligne (Piper via sherpa-onnx), modèles dans `tts-models/`.
- `scripts/music.js` : musique et applaudissements synthétisés (libres de droits).

```bash
npm install && pip install sherpa-onnx numpy
# modèles de voix (une fois) :
mkdir -p tts-models && cd tts-models && for v in fr_FR-upmc-medium fr_FR-tom-medium fr_FR-siwis-medium; do \
  curl -sL https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-$v.tar.bz2 | tar xj; done; cd ..
npm run voices   # génère public/voice/*.wav
npm run studio   # prévisualisation
npm run render   # -> out/pub.mp4
```

## Crédits voix (à citer si diffusion)

Voix Piper : *upmc* (Pierre, Jessica — CC BY-SA 4.0), *tom* (AGPL-3.0), *siwis* (CC BY 4.0).

À compléter avant diffusion : `[NUMÉRO]`, `[PRIX]`, `[INFORMATIONS]` dans `src/story.tsx` (composant `CTA`).

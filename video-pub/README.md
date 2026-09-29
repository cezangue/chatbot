# Publicité vidéo — La Nouvelle Méthode PowerPoint

Vidéo Remotion (1920×1080, 30 i/s, ~3 min 48 s) qui suit le scénario en 21 scènes :
Jean écarté → flash-back → présentation ratée (slide d'Esther) → Paul applique la méthode en 8 étapes →
présentation réussie → comparaison → produit → « Pour qui ? » (Sonia, élèves, pros, enseignants, entrepreneurs) → appel à l'action.

- `src/kit.tsx` : personnages « Bonhomme », sous-titres, fenêtre PowerPoint simulée, slides « avant / après ».
- `src/scenes.tsx` : les scènes. `src/Pub.tsx` : ordre et durée des scènes.
- `public/` : les 4 images fournies + police Montserrat. `scripts/music.js` génère la musique (synthèse, libre de droits).

```bash
npm install
npm run studio   # prévisualisation interactive
npm run render   # -> out/pub.mp4
```

À compléter avant diffusion : `[NUMÉRO]`, `[PRIX]`, `[INFORMATIONS]` dans `src/scenes.tsx` (scène S20).

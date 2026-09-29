# Plans vidéo réalistes à générer (même style que `clips/s01.mp4`)

Le clip fourni (scène 1, M. Koffi) a été généré par un outil vidéo IA. Pour que **toute** la publicité ait ce rendu,
générez les plans ci-dessous avec **le même outil**, en réutilisant les descriptions de personnages mot pour mot
(c'est ce qui garde les mêmes visages d'un plan à l'autre). Déposez chaque fichier dans `public/clips/` sous le nom indiqué :
je l'intègre à la place des photos fixes, avec les sous-titres.

**Règle pour les écrans :** ne demandez pas à l'IA d'afficher des diapositives lisibles (elle invente du texte illisible).
Filmez les écrans de dos, flous ou hors champ : les **vraies diapositives** (fichiers dans `decks/out/`) sont insérées au montage.

## Personnages (à copier dans chaque prompt)

- **M. KOFFI (directeur)** : Black African man in his mid-50s, short greying hair, grey stubble beard, black rectangular glasses, charcoal grey suit, white shirt, dark tie, calm and authoritative.
- **JEAN** : Black African man, about 28, short black hair, short beard, white shirt with sleeves, no tie, anxious.
- **PAUL** : Black African man, about 28, short black hair, light beard, white shirt, navy tie, calm and organised.
- **ESTHER** : Black African woman, about 25, curly shoulder-length hair, grey sleeveless dress, confident and cheerful.
- **POSE (narrateur)** : Black African man, about 30, short hair, navy blazer over black t-shirt, warm smile, speaks to camera.
- **SONIA** : Black African woman, about 24, curly hair, white blouse, engineering student.

**Décor commun** : modern high-rise office in an African city at golden hour, floor-to-ceiling windows with skyline, abstract paintings, warm cinematic lighting, shallow depth of field, 16:9, realistic film look.

## Plans (8 s chacun)

| Fichier | Scène | Prompt (à compléter par les personnages ci-dessus) | Réplique |
|---|---|---|---|
| `s02.mp4` | Pose face caméra | POSE walks along the office corridor toward the camera, stops and speaks directly to camera, intrigued tone. | « Mais savez-vous pourquoi le directeur a refusé que Jean fasse la présentation… et a choisi Paul à sa place ? » |
| `s03.mp4` | 3 jours plus tôt | M. KOFFI hands a folder to JEAN in his office; JEAN smiles and nods. | Koffi : « Jean, j'aimerais que ce soit toi qui présentes le projet à la prochaine réunion. » Jean : « Oui, Monsieur. Aucun problème. » |
| `s04.mp4` | Jean perdu | JEAN alone at his desk, laptop screen seen from behind, he scratches his head, confused. | « Euh… on commence même comment ici ? » |
| `s05.mp4` | Jean demande de l'aide | JEAN turns to ESTHER at the next desk; she rolls her chair over, enthusiastic. | Jean : « Esther, tu peux m'aider avec PowerPoint ? » Esther : « PowerPoint ? Ça, je maîtrise ! Viens. » |
| `s06.mp4` | Réunion ratée | Meeting room, JEAN presenting next to a projector screen (screen out of focus), colleagues look lost, one yawns, M. KOFFI frowns. | « Euh… pardon… une seconde… » |
| `s07.mp4` | Jean déçu | JEAN walks back to his desk, sits down slowly, disappointed, looks at his laptop. | « Pourtant, j'ai fait tout ce qu'il fallait… » |
| `s08.mp4` | Paul et le manuel | PAUL at his desk opens a printed manual (cover not readable), takes notes, focused, then smiles. | (pas de dialogue) |
| `s09.mp4` | Paul répète | PAUL rehearses alone in the empty meeting room, gesturing confidently toward a screen (out of focus). | (pas de dialogue) |
| `s10.mp4` | Réunion réussie | Same meeting room, PAUL presents confidently, colleagues attentive and nodding, M. KOFFI takes notes and smiles. | Collègue : « Ah oui… là, c'est beaucoup plus clair. » |
| `s11.mp4` | Félicitations | M. KOFFI stands and shakes PAUL's hand, colleagues applaud. | « Très bonne présentation, Paul. C'était clair, structuré et professionnel. » |
| `s12.mp4` | Soutenance de Sonia | University amphitheatre, SONIA presents to a jury of three, screen out of focus; at the end the jury applauds, she smiles, relieved. | (voix off) |
| `s13.mp4` | Jean et Paul | Office, JEAN approaches PAUL's desk; PAUL shows him the manual. | Jean : « Paul, tu as fait comment ? » Paul : « J'ai simplement suivi une méthode. » |
| `s14.mp4` | Pose final | POSE faces the camera holding the manual, confident smile. | « Commencez simplement avec la bonne méthode. » |

Astuce : si l'outil le permet, donnez-lui une image de référence de chaque personnage (une capture du clip 1 pour M. Koffi,
Jean et Paul) pour garder exactement les mêmes visages.

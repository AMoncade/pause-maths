// Propriété du lot STT1700. Thèmes dérivés du matériel de D:\Math\STT1700 (voir docs/sources/stt1700.md).
import type { Course } from '@/lib/types';

export const stt1700: Course = {
  code: 'STT1700',
  title: 'Introduction à la statistique',
  color: '#22c55e',
  topics: [
    { id: 'stt1700-descr', label: 'Statistique descriptive, corrélation et droite des moindres carrés', exam: 'intra', defaultOn: true },
    { id: 'stt1700-prob', label: 'Probabilités, conditionnelle et indépendance', exam: 'intra', defaultOn: false },
    { id: 'stt1700-var', label: 'Variables aléatoires discrètes, binomiale et multinomiale', exam: 'intra', defaultOn: false },
    { id: 'stt1700-cont', label: 'Lois continues et théorème limite central', exam: 'final', defaultOn: false },
    { id: 'stt1700-est', label: 'Estimations ponctuelles', exam: 'final', defaultOn: false },
    { id: 'stt1700-ic', label: 'Intervalles de confiance pour grands échantillons', exam: 'final', defaultOn: false },
    { id: 'stt1700-test', label: "Tests d'hypothèses pour grands échantillons", exam: 'final', defaultOn: false },
    { id: 'stt1700-petit', label: 'Inférence pour petits échantillons', exam: 'final', defaultOn: false },
    { id: 'stt1700-khi', label: 'Tests de khi-deux', exam: 'final', defaultOn: false },
    { id: 'stt1700-reg', label: 'Régression linéaire simple (inférence)', exam: 'final', defaultOn: false },
  ],
};

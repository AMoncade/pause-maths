// src/lib/math.ts appartient à l'admin ; le lot Engine le teste.
import { describe, expect, it } from 'vitest';
import { formulasOf, hasStrayDollar, splitMath } from '@/lib/math';

const R = String.raw;

describe('splitMath', () => {
  it('découpe texte, inline et display', () => {
    expect(splitMath(R`Soit $x^2$ et $$\int_0^1 f$$ fin`)).toEqual([
      { kind: 'text', value: 'Soit ' },
      { kind: 'inline', value: 'x^2' },
      { kind: 'text', value: ' et ' },
      { kind: 'display', value: R`\int_0^1 f` },
      { kind: 'text', value: ' fin' },
    ]);
  });

  it('texte sans formule et chaîne vide', () => {
    expect(splitMath('Aucune formule')).toEqual([{ kind: 'text', value: 'Aucune formule' }]);
    expect(splitMath('')).toEqual([]);
  });

  it('\\$ hors formule devient un dollar littéral', () => {
    expect(splitMath(R`coûte 5\$ par mois`)).toEqual([{ kind: 'text', value: 'coûte 5$ par mois' }]);
  });

  it('\\$ dans une formule ne la ferme pas et reste tel quel pour KaTeX', () => {
    expect(splitMath(R`$a \$ b$ puis`)).toEqual([
      { kind: 'inline', value: R`a \$ b` },
      { kind: 'text', value: ' puis' },
    ]);
  });

  it('les commandes LaTeX (\\\\ de matrice inclus) ne ferment pas une formule display', () => {
    expect(splitMath(R`$$\begin{pmatrix} 1 \\ 2 \end{pmatrix}$$`)).toEqual([
      { kind: 'display', value: R`\begin{pmatrix} 1 \\ 2 \end{pmatrix}` },
    ]);
  });

  it('formules collées : $a$$b$ = deux inline', () => {
    expect(splitMath('$a$$b$')).toEqual([
      { kind: 'inline', value: 'a' },
      { kind: 'inline', value: 'b' },
    ]);
  });

  it('un $ ouvert sans fermeture reste dans le texte', () => {
    expect(splitMath('coûte 5$ par mois')).toEqual([{ kind: 'text', value: 'coûte 5$ par mois' }]);
    expect(splitMath('$$x$')).toEqual([
      { kind: 'text', value: '$' },
      { kind: 'inline', value: 'x' },
    ]);
  });
});

describe('hasStrayDollar', () => {
  it('détecte un dollar orphelin', () => {
    expect(hasStrayDollar('coûte 5$ par mois')).toBe(true);
    expect(hasStrayDollar('$x$ et 3$')).toBe(true);
    expect(hasStrayDollar('$$x$')).toBe(true);
    expect(hasStrayDollar('$$')).toBe(true);
  });

  it('ne signale ni formule bien fermée ni dollar échappé', () => {
    expect(hasStrayDollar('$x$ et $$y$$')).toBe(false);
    expect(hasStrayDollar(R`coûte 5\$ par mois`)).toBe(false);
    expect(hasStrayDollar(R`prix \$5 et $x^2$`)).toBe(false);
    expect(hasStrayDollar(R`$$a$$ puis \$ puis $b$`)).toBe(false);
    expect(hasStrayDollar(R`$a \$ b$`)).toBe(false);
    expect(hasStrayDollar('sans dollar')).toBe(false);
  });
});

describe('formulasOf', () => {
  it('renvoie les formules inline et display dans l\'ordre', () => {
    expect(formulasOf(R`$a$ puis $$\frac{1}{2}$$ puis \$3 puis $b$`)).toEqual(['a', R`\frac{1}{2}`, 'b']);
    expect(formulasOf('rien')).toEqual([]);
  });
});

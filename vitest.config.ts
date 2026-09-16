// Propriété du lot Engine (adrie-79).
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Fuseau fixe : dayKey/streak dépendent de l'heure locale (tests de changement d'heure au 1er novembre 2026).
process.env.TZ = 'America/Toronto';

export default defineConfig({
  define: { __BUILD_DATE__: JSON.stringify('test') },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // tests/ui/** (lot UI) peut passer en DOM avec le commentaire `// @vitest-environment jsdom` en tête de fichier.
  test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node' },
});

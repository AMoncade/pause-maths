import { render } from 'preact';
import { App } from './app';
import { initPwa } from '@/lib/ui-engine';

initPwa();
render(<App />, document.getElementById('app')!);

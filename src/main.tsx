import { render } from 'preact';
import { App } from './app';
import { initPwa } from '@/lib/pwa';

initPwa();
render(<App />, document.getElementById('app')!);

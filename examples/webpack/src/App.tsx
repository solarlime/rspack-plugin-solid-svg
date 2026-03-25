import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import iconUrl from './icon.svg';

import Icon from './icon.svg?solid';

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>Solid SVG Plugin Test</h1>

      {/* Test component import */}
      <Icon width={50} height={50} fill="blue" />

      {/* Test URL import */}
      <img src={iconUrl} alt="Icon" width={50} height={50} />

      {/* Test interactivity */}
      <button onClick={() => setCount(count() + 1)} type="button">
        Count: {count()}
      </button>

      <Icon width={20 + count() * 2} height={20 + count() * 2} fill="red" />
    </div>
  );
}

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
} else {
  console.log('No root to render App');
}

import { useState } from 'react';

const colors = [
  { name: 'Green', value: '#21a366' },
  { name: 'Red', value: '#e5484d' },
  { name: 'Blue', value: '#3485e4' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
];

function normalizeHex(value) {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) {
    return null;
  }

  const hex = value.slice(1);
  const expandedHex =
    hex.length === 3
      ? [...hex].map((character) => `${character}${character}`).join('')
      : hex;

  return `#${expandedHex.toUpperCase()}`;
}

function App() {
  const [selectedColor, setSelectedColor] = useState(null);
  const [hexDraft, setHexDraft] = useState('#000000');
  const [hexError, setHexError] = useState('');

  function selectColor(color) {
    setSelectedColor(color);
    setHexDraft(color.value.toUpperCase());
    setHexError('');
  }

  function applyCustomColor(event) {
    event.preventDefault();

    const normalizedHex = normalizeHex(hexDraft.trim());
    if (!normalizedHex) {
      setHexError('Enter a valid HEX color, such as #3485E4.');
      return;
    }

    setSelectedColor({ name: 'Custom', value: normalizedHex });
    setHexDraft(normalizedHex);
    setHexError('');
  }

  return (
    <main className="page">
      <section className="picker" aria-labelledby="page-title">
        <header className="picker__header">
          <p className="eyebrow">INTERACTIVE COLOR PICKER</p>
          <h1 id="page-title">Choose a color</h1>
          <p className="picker__hint">
            Select a color to fill the circle.
          </p>
        </header>

        <div className="canvas">
          <div
            className={`color-circle${selectedColor ? ' color-circle--filled' : ''}`}
            style={{ '--circle-color': selectedColor?.value ?? 'transparent' }}
            role="img"
            aria-label={
              selectedColor
                ? `Circle filled with ${selectedColor.name.toLowerCase()}`
                : 'Empty circle'
            }
          >
            {!selectedColor && <span className="color-circle__prompt">Pick a color</span>}
          </div>

          <fieldset className="color-options">
            <legend className="sr-only">Choose a circle color</legend>
            {colors.map((color) => (
              <label className="color-option" key={color.name}>
                <input
                  type="radio"
                  name="circle-color"
                  value={color.name}
                  checked={selectedColor?.name === color.name}
                  onChange={() => selectColor(color)}
                />
                <span className="color-option__swatch" style={{ '--swatch-color': color.value }} />
                <span className="color-option__name">{color.name}</span>
              </label>
            ))}
          </fieldset>

          <form className="custom-color" onSubmit={applyCustomColor}>
            <label className="custom-color__label" htmlFor="custom-color-hex">
              Or enter a custom color
            </label>
            <div className="custom-color__controls">
              <label className="sr-only" htmlFor="custom-color-picker">
                Choose a custom color
              </label>
              <input
                className="custom-color__picker"
                id="custom-color-picker"
                type="color"
                value={normalizeHex(hexDraft) ?? '#000000'}
                onChange={(event) => {
                  setHexDraft(event.target.value.toUpperCase());
                  setHexError('');
                }}
              />
              <input
                className="custom-color__hex"
                id="custom-color-hex"
                type="text"
                value={hexDraft}
                onChange={(event) => {
                  setHexDraft(event.target.value);
                  setHexError('');
                }}
                aria-invalid={Boolean(hexError)}
                aria-describedby={hexError ? 'custom-color-error' : 'custom-color-help'}
                autoComplete="off"
                spellCheck="false"
                maxLength={7}
              />
              <button className="custom-color__apply" type="submit">
                Apply
              </button>
            </div>
            <p
              className={`custom-color__message${hexError ? ' custom-color__message--error' : ''}`}
              id={hexError ? 'custom-color-error' : 'custom-color-help'}
              aria-live="polite"
            >
              {hexError || 'Use a HEX value such as #3485E4.'}
            </p>
          </form>
        </div>

        <p className="selection-status" aria-live="polite">
          {selectedColor
            ? `Circle color: ${selectedColor.name}`
            : 'No color selected'}
        </p>
      </section>
    </main>
  );
}

export default App;

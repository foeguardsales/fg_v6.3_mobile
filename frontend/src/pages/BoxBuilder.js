// Fix cart icon color - add style to make emoji white
// Line 323 - wrap emoji in span with filter
            >
              <span style={{ filter: 'grayscale(1) brightness(5)' }}>🛒</span> {getTotalSelectedLbs()}/{boxSize}lb
              {isBoxComplete && (
                <span className="cart-complete-badge">✓</span>
              )}
            </button>
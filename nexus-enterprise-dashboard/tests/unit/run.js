import { formatCurrency, debounce, generateId } from '../../js/utils/helpers.js';
import { isEmail, isRequired } from '../../js/utils/validators.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}: ${e.message}`);
  }
}

console.log('Running unit tests...\n');

test('formatCurrency formats USD', () => {
  const result = formatCurrency(1234.5);
  if (!result.includes('1,234')) throw new Error(`Got ${result}`);
});

test('generateId returns unique strings', () => {
  const a = generateId();
  const b = generateId();
  if (a === b) throw new Error('IDs should be unique');
});

test('isEmail validates emails', () => {
  if (!isEmail('test@example.com')) throw new Error('Valid email rejected');
  if (isEmail('invalid')) throw new Error('Invalid email accepted');
});

test('isRequired checks values', () => {
  if (!isRequired('hello')) throw new Error('Non-empty rejected');
  if (isRequired('')) throw new Error('Empty accepted');
});

test('debounce delays execution', () => {
  let count = 0;
  const fn = debounce(() => count++, 50);
  fn(); fn(); fn();
  if (count !== 0) throw new Error('Should not execute immediately');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

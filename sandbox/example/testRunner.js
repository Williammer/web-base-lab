var compileCode = require("../src/sandbox").compileCode;

const rawTest = `
  test('success test: 1 + 1 = 2', () => {
    const a = 1;
    const b = 1;
    expect(add(a, b)).toBe(2);
  });

  test('failed test: 1 + 2 = 2', () => {
    const a = 1;
    const b = 2;
    expect(add(a, b)).toBe(2);
  });
`;

function add(a, b) {
  return a + b;
};

function expect(value) {
  return {
    toBe(expectedValue) {
      if(value !== expectedValue){
        throw new Error(`expect ${value} to be ${expectedValue}`);
      }

      return true;
    }
  };
};

function test(desc, runner) {
  let output = `✓ ${desc}`;
  try {
    runner();
  } catch (err) {
    output = `✕ ${desc}
    ${err}
    `;
  }

  console.log(output);
};

// option 1: use eval which has local and global scope for the code to evaluate.
// eval(rawTest);


// option 2: use sandbox and pass globals in it, which is more secure.
const code = compileCode(rawTest);
const globals = { test, expect, add };
code(globals);

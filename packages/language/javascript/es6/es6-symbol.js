/*
 * These sugars can be played in console after opened index.html.
 * Ref: https://ponyfoo.com/articles/es6-symbols-in-depth
 */
// 1. Symbol as unique ID -- internal property
// 2. Symbol with global registry
let uniqueSymbol = Symbol("uniqueID");
let registeredSymbol = Symbol.for("keyInRunTimeRegistry"); //
let registeredSymbol2 = Symbol.for("keyInRunTimeRegistry");
print(`1. typeof uniqueSymbol is : ${typeof uniqueSymbol} ; typeof registeredSymbol is : ${typeof registeredSymbol}`);
print(`1.0 Unlike Symbol('xx') that are unique every call, registry symbol are the same every time it's called: ${registeredSymbol === registeredSymbol2}`);

print(`1.1. uniqueSymbol: ${uniqueSymbol.toString()}`);
print(`1.1. registeredSymbol: ${registeredSymbol.toString()}`);
print(`1.2 Symbol not in registry -> Symbol.keyFor(uniqueSymbol): ${Symbol.keyFor(uniqueSymbol)}`); // underfined if Symbol not in registry
print(`1.2 Symbol in registry -> Symbol.keyFor(registeredSymbol): ${Symbol.keyFor(registeredSymbol)}`); // (Symbol) => key

print('');
print(`** 2.
! Use Symbol to avoid name clashes in property keys;
! Defined protocol of custom iterator rules;

const objWithSymbol = {
  [Symbol.iterator]: () => ({
    items: ['p', 'o', 'n', 'y', 'f', 'o', 'o'],
    next: function next () {
      return {
        done: this.items.length === 0,
        value: this.items.shift()
      }
    }
  }),
  [uniqueSymbol]: "can't equal to anyshit",
  [registeredSymbol]: "global registry spreads the run time",
  normalProp: "u are fu*king normal"
}`);

const objWithSymbol = {
  [Symbol.iterator]: () => ({
    items: ['p', 'o', 'n', 'y', 'f', 'o', 'o'],
    next: function next() {
      return {
        done: this.items.length === 0,
        value: this.items.shift()
      }
    }
  }),
  [uniqueSymbol]: "can't equal to anyshit",
  [registeredSymbol]: "global registry spreads the run time",
  normalProp: "u are fu*king normal"
};

printKeyValue('2.0 objWithSymbol[uniqueSymbol]', objWithSymbol[uniqueSymbol]);
printKeyValue('2.1.1 Object.keys(objWithSymbol)', Object.keys(objWithSymbol));
printKeyValue('2.1.1 Object.getOwnPropertyNames(objWithSymbol)', Object.getOwnPropertyNames(objWithSymbol));
printKeyValue('2.1.2 JSON.stringify(objWithSymbol)', JSON.stringify(objWithSymbol));
print('2.1.3 not for in either...');

print(`2.2 Object.getOwnPropertySymbols(objWithSymbol):`);
print(Object.getOwnPropertySymbols(objWithSymbol)); // show all the symbols in an object
print('');

// 2.3 iterator, iterable. ref: https://ponyfoo.com/articles/es6-iterators-in-depth
printKeyValue('* 2.3.1 [...objWithSymbol]', [...objWithSymbol]);
printKeyValue('* 2.3.2 Array.from(objWithSymbol)', Array.from(objWithSymbol));
print('* 2.3.3 for(let item of objWithSymbol):');
for (let item of objWithSymbol) {
  printKeyValue('2.3.3 each item: ', item);
}
print('');

// 2.4 iterator wth generator
print(`
* 2.4 iterator wth generator:
	class Collection { * [Symbol.iterator]() {
	    var i = 0;
	    while (this[i] !== undefined) {
	      yield this[i];
	      ++i;
	    }
	  }
	}

	let myCollection = new Collection();
	myCollection[0] = 1;
	myCollection[1] = 2;
`);

class Collection { * [Symbol.iterator]() {
    var i = 0;
    while (this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;
for (let value of myCollection) {
  print(`2.4.1 myCollection value: ${value}`); // 1, then 2
}

// 3.0. instanceof Extended class false by default
class MyArrayInherit extends Array {}

print(`3. instanceof of extended class: ${[] instanceof MyArrayInherit}`); // false

// 3.1. Symbol for instanceOf vs. class inherit
class MyArraySymbol {
  static[Symbol.hasInstance](instance) { // meta intercepted 'instanceof' operator
    return Array.isArray(instance);
  }
}

print(`3.1 instanceof of Symbol.hasInstance: ${[] instanceof MyArraySymbol}`); // true
print('');


// 4. Symbol.match
const text = '/foo/';
const literal = /foo/;
literal[Symbol.match] = false;
print(` 4:
Symbol.match:
	const text = '/foo/';
	const literal = /foo/;
	literal[Symbol.match] = false;
	text.startsWith(literal) ： ${text.startsWith(literal)}
`);


// 5+ well-know Symbol: https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/
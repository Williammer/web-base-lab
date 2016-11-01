// 1. Symbol as unique ID -- internal property
// 2. Symbol with global registry
let newSymbol = Symbol("uniqueIDFor");
let newSymbolReg = Symbol.for("uniqueIDFor");
let newSymbolReg2 = Symbol.for("uniqueIDFor");
print(`Unlike Symbol('xx') that are unique every call, registry symbol are the same every time it's called: ${newSymbolReg === newSymbolReg2}`);

let oneTypeOfObj = {
    [newSymbol]: "inner heart: bilus"
};

print(newSymbol);
print(newSymbolReg);
print(oneTypeOfObj);
print(Object.getOwnPropertySymbols(oneTypeOfObj)); // show all the symbols in an object

print(`underfined if Symbol not in registry: ${Symbol.keyFor(newSymbol)}`); // underfined if Symbol not in registry
print(`Symbol in registry: ${Symbol.keyFor(newSymbolReg)}`); // (Symbol) => key
print(`get even it's local symbol:`); // get: (key) => Symbol
print(Symbol.for("uniqueIDFor"));


// Symbol for iterator use case: every [Symbol.iterator] DataStructure can be for-of or use Iterator methods.
// 3. Symbol for instanceOf vs. class inherit
class MyArraySymbol {
    static[Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}

print(`instanceof of Symbol.hasInstance: ${[] instanceof MyArraySymbol}`); // true


// r. class OOP things
class MyArrayInherit extends Array {}

print(`instanceof of extended class: ${[] instanceof MyArrayInherit}`); // false ?

/*
 * Arrow function; Spread/Rest; Iterator/for..of
 */


// 1. basic arrow function
const upper = input => input.toUpperCase()

// 2.1 Spread/Rest turn arguments into real array
const show = (info, ...others) => {
    print(`param: ${info}`)

    if (!(others.length > 0)) {
        print(`no other param, others.length: ${others.length}`)
        return
    }

    // for(const param of others) { // 1. for...of loop
    for (let ret, param, iterator = others[Symbol.iterator]();
        (ret = iterator.next()) && !ret.done; /* not other action for each loop */ ) { // 2. Symbol.iterator loop
        param = ret.value
        print(`other param: ${upper(param)}`) // template literals
    }
}

show("I love u.", "and you", "and youAll")

// 2.2 Spread array
let myArray =  ["a", "b", "c"];
console.log(...myArray);

// 3. closure in arrow function
// "compose functions"
const compose = functions => arg => functions.reduce((composed, f) => f(composed), arg)

const f1 = (x) => x*2
const f2 = (x) => x+2
const f3 = (x) => Math.pow(x,2)

const f4 = (x) => x.split("").concat().reverse().join("").split(" ")
const f5 = (xs) => xs.concat().reverse()
const f6 = (xs) => xs.join("_")

print(compose([f1,f2,f3])(0))
print(compose([f1,f2,f3])(2))
print(compose([f3,f2,f1])(2))
const code = compileCode('return num1 + num2')

// this logs 17 to the console
console.log(code({ num1: 10, num2: 7 }))


// [Gobal access]
const globalNum = 12
const otherCode = compileCode('return globalNum')

// global scope access is prevented
// this logs undefined to the console
console.log(otherCode({ num1: 2, num2: 3 }))

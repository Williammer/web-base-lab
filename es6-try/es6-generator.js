// 1. Inifinte get values.
function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

let [a, b, c, d, e, f] = fibs();

console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e);
console.log(f);

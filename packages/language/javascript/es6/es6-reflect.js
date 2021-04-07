// *1. Default behavior in Proxy Traps
print(`
*1. Default behavior in Proxy Traps
const handler = {
  get() {
    return Reflect.get(...arguments);
  }
};

const target2 = { a: 'b' };
const proxy = new Proxy(target, handler);
`);

const handler = {
  get() {
    return Reflect.get(...arguments);
  }
};
const target2 = { a: 'b' };
const proxy = new Proxy(target2, handler);
printKeyValue('proxy.a', proxy.a);


// 2. Reflect.construct
print(`
2. Reflect.construct
const d = Reflect.construct(Date, [1776, 6, 4]);
`);

// const newDate = function() {}; // could override with newDate on 3rd param.
const d = Reflect.construct(Date, [1776, 6, 4] /*, newDate*/ );

printKeyValue('d instanceof Date', d instanceof Date); // true
print('Reflect.getPrototypeOf(d):');
print(Reflect.getPrototypeOf(d));
printKeyValue('d.getFullYear()', d.getFullYear()); // 1776


// 3. delete prop - replaced delete operator
print(`
3. delete prop - replaced delete operator
let target = { foo: 'bar', baz: 'wat' }
Reflect.deleteProperty(target, 'foo')
`);

let target = { foo: 'bar', baz: 'wat' };
Reflect.deleteProperty(target, 'foo');

print(target);


// 4. Reflect.apply
print(`
4. Reflect.apply
	Array.proptype.slice.call(arguments);
now can be:
	Reflect.apply(Array.proptype.slice, arguments);
`);

// 5. Reflect.set/getPrototypeOf
print(`
5. Reflect.set/getPrototypeOf
	var myObj = new FancyThing();
	assert(Reflect.setPrototypeOf(myObj, OtherThing.prototype) === true);
	assert(Reflect.getPrototypeOf(myObj) === OtherThing.prototype);

	// Old style
	assert(Object.setPrototypeOf(myObj, OtherThing.prototype) === myObj);
	assert(Object.getPrototypeOf(myObj) === FancyThing.prototype);

	Object.setPrototypeOf(1); // TypeError
	Reflect.setPrototypeOf(1); // TypeError

	var myFrozenObj = new FancyThing();
	Object.freeze(myFrozenObj);

	Object.setPrototypeOf(myFrozenObj); // TypeError
	assert(Reflect.setPrototypeOf(myFrozenObj) === false);
`);

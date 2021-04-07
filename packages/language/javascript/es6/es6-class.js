/**
 * 1. Essense of es6 class, with 6 differences from es5 proto func class

   let Class = class ClassName {
      constructor(name) {
          this.name = name;
      }

      sayName() {
          console.log(this.name);
      }
  };

 */
// 1.1 can't hoisted by being let
let Class = (function() {

  "use strict"; // 1.2 always strict mode inside

  // 1.3 forbid overwrite class name internally by being const
  const ClassName = function(name) {
    // 1.4 make sure the function was called with new
    if (typeof new.target === "undefined") {
      throw new Error("Constructor must be called with new.");
    }

    this.name = name;
  }

  Object.defineProperty(ClassName.prototype, "sayName", {
    value: function() {

      // 1.5 make sure the method wasn't called with new
      if (typeof new.target !== "undefined") {
        throw new Error("Method cannot be called with new.");
      }

      console.log(this.name);
    },
    enumerable: false, // 1.6 can't enum methods
    writable: true,
    configurable: true
  });

  return ClassName;
}());


// Another example:
// Requirements:
// ?  0. prototype real-only // chrome didn't seem hv it

  // 1. strict mode by default

  // 2.1 throw if called class function directly

  // 2.2 throw if new the method

  // 2.3 throw if try to override class variable inside
  // 2.4 reject silently if try to override class name

  // 3. not hoisted, use let/const

  // 4. non-enumable methods, use defineProperty for methods




/* class Sample {
  constuctor() {
    this._inited = true;
  }

  meth(){
    console.log('I am method');
  }
}
*/


var Sample = (function (){
  'use strict';

  const Sample = function () {
    if (typeof new.target === 'undefined') {
      throw new Error('throw if called class function directly')
    }
    this._inited = true;
  }

  Object.defineProperty(Sample.prototype, 'name', {
    configurable: false,
    // set: function(){
    //  throw new Error('should not set class name');
    // },
    get: function(){
      return 'Sample';
    },
  })

  Object.defineProperty(Sample.prototype, 'meth', {
    enumerable: false,
    value: function(){
      if (typeof new.target !== 'undefined') {
        throw new Error('throw if new the method')
      }
      console.log('I am method');
    },
  })

  return Sample;
})()

var b = new Sample('param');

// ------------------------------
//  to be verified
// ------------------------------
/*
 * Multi-inheritance with mixin and es6 class
 */
function mix(...mixins) {
  class Mix {}
  // 以编程方式给Mix类添加
  // mixins的所有方法和访问器
  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }
  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

/*
 * Static prop on class
 */
class T {
  constructor(opts) {
    this._a = 's';
  }
}

T.propp = "pppp";

print("T.propp: ");
print(T.propp);

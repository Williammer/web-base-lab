/**
 * Common ways for type extracting
 */
interface Dictionary<T = any> {
  [key: string]: T;
}

type Tbool = Dictionary<boolean>;
type Tstring = Dictionary<string>;

// [infer] define a temp new type variable to extract specfied T type
type EType<T> = T extends Dictionary<infer NewType> ? NewType : never;

// usage
type Ebool = EType<Tstring>;

// ------
async function personPromise() {
  return { name: "Semlinker", age: 30 };
}
const cpx = { objec: { k: 'asdfasdf' }, arr: [1, false, 'asdf', { x: 'b' }], func() { return 'sx' } };
// [typeof] to make example become a generic type, which could serves as type generator
type typeOfT = typeof personPromise;
type typeOfO = typeof cpx;

//extract Promise type
type PromiseType<T> = (args: any) => Promise<T>;
type UnPromiseType<T> = T extends PromiseType<infer NewType> ? NewType : never;

// usage
type PTbool = PromiseType<Tbool>;
type DicBool = UnPromiseType<PTbool>;

// =-------=
// <<type>value>  nested type
type RetType = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type FnT<T> = (p: string, q: boolean) => T extends (typeof p | typeof q) ? T : never;
type FnTString = FnT<string>;
type RFnT = ReturnType<FnTString>;

type FirstArgsType<T> = T extends ((a: infer ArgType) => any ) ? ArgType : never;
type SingleArgFunc = (a: string) => any;

type FirstArgFnT = FirstArgsType<SingleArgFunc>;

type VariadicFn<ArgTypes extends any[]> = (...args: ArgTypes) => any;
type ArgsType<T> = T extends VariadicFn<infer ATs> ? ATs : never;
type ArgsFnT = ArgsType<FnTString>;
/*
type ReturnType<T extends (...args: any) => any> = T
  extends (...args: any) => infer R ? R : any;
*/
// [infer] auto make union type
type InferredAb<T> = T extends { a: infer U, b: infer U } ? U : T;
type abInferredNumber = InferredAb< { a :number, b: number}>;
let abinf : abInferredNumber = 1;

// infer U auto make union type `boolean | string`
type abInferredNumberString = InferredAb<{ a: boolean, c: number, b: string}>;
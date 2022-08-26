"use strict";
// Reflect tem objetivo de garantir a semantica e a segurança de objetos
const assert = require("assert");

// ------ apply - vimos no modulo de siclo de vida

const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue;
  },
};

// realiza a soma do arg1 + arg2 + value
assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// um problea que pode acontecer (raro) se passado antes da nossa função
// Function.prototype.apply = () => {
//   throw new TypeError("Eita!");
// };

// outra coisa que pode acontecer, é o usuario passar um função como argumentos para dentro do apply
myObj.add.apply = function () {
  throw new TypeError("Eita-2!");
};
assert.throws(() => myObj.add.apply({}, []), {
  name: "TypeError",
  message: "Eita-2!",
});

// USANDO O REFLECT
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result, 260);

// --- defineProperty
// questoes de semantica

function MyDate() {}
// para definir uma propriedade para essa função tempos que utilizar o defineProperty
// passando a função escolhida, o nome da propriedade e o seu valor
Object.defineProperty(MyDate, "withObject", { value: () => "hey there" });
// dessa forma é feio pra kraio, Object adicionand prop para uma function?

// por questoes de semantica e boas praticas fazemos isso com o Reflect
// é a mesma coisa, mas é o mais semantico
Reflect.defineProperty(MyDate, "withReflection", { value: () => "hey dude" });

assert.deepStrictEqual(MyDate.withObject(), "hey there");
assert.deepStrictEqual(MyDate.withReflection(), "hey dude");
// o reflection também preve que se passado diretamente um tipo primitivo dentro dele
// vai estourar um erro

// --- deleteProperty

const withDelete = { user: "TiagoLandim" };
delete withDelete.user;
// motodo tradicional - deletamos a propriedade "user"
// deve ser evitado, imperformatico
assert.deepStrictEqual(withDelete.hasOwnProperty("user"), false);

const withReflectionDelete = { user: "TiagoBeidaki" };
Reflect.deleteProperty(withReflectionDelete, "user");
assert.deepStrictEqual(withReflectionDelete.hasOwnProperty("user"), false);
// dessa forma temos melhor performance e respeitamos o ciclo de vida do JS

// ------ Get
// Deveriamos fazer um get somente em instancias de referencias
// aqui tentamos pegar o 1 com a chave "username"
// deveria retornar um erro
assert.deepStrictEqual((1)["userName"], undefined);

// com reflection, vai estourar uma exceção
assert.throws(() => Reflect.get(1, "userName"), TypeError);

// ----- has
// aqui estamos procurando se a nossa chave contem em nosso objeto
assert.ok("superman" in { superman: "" });
// com Reflect é apenas mais semantico
assert.ok(Reflect.has({ batman: "" }, "batman"));

// ---- ownkeys
// quando queremos pegar os Symbols e os Objetos ao mesmo tempo
// precisamos realizar duas chamadas para isso
const user = Symbol("user");
const dataBaseUser = {
  id: 1,
  [Symbol("password")]: 123,
  [user]: "tiagoLandim",
};

// Com os metodos de Object precisamos realizar duas requisições
const objectKey = [
  ...Object.getOwnPropertyNames(dataBaseUser),
  ...Object.getOwnPropertySymbols(dataBaseUser),
];
console.log("objectKey", objectKey);
assert.deepStrictEqual(objectKey, ["id", Symbol(password), Symbol(user)]);
// ReferenceError: password is not defined ???????????????

// com reflection
const reflectKeys = Reflect.ownKeys(dataBaseUser);
console.log("reflectKeys", reflectKeys);
// assert.deepEqual(
// Reflect.ownKeys(dataBaseUser, ["id", Symbol.for(password), user])
// );
// ReferenceError: password is not defined ???????????????

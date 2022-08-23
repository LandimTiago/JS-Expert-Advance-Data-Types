const assert = require("assert");

// ----- keys
const uniqueKey = Symbol("userName");
const user = {};

user["userName"] = "value for normal Objects";
user[uniqueKey] = "value for Symbol";

// console.log("getting normal Objects", user.userName);
// console.log("getting normal Objects", user[Symbol("userName")]);
// Isso garante a segurança, se é uma função privada, um metodo privado,
// se não for exportado o Symbol o usuario não consegue acessar os dados
// console.log("getting normal Objects", user[uniqueKey]);

assert.deepStrictEqual(user.userName, "value for normal Objects");
// Sempre unico em nivel endereço de memoria
assert.deepStrictEqual(user[Symbol("userName")], undefined);
assert.deepStrictEqual(user[uniqueKey], "value for Symbol");

//console.log("Symbols of project", Object.getOwnPropertySymbols(user));
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);
// Assim conseguimos ver quais os simbols do projeto
// Esse dado apenas é mais dificil de ser acessado, mas ele não fica como secreto
// Se debugarmos com um brakepoint neste console conseguimos visualisar seus tipos
// Symbol(userName):'value for Symbol'
// userName:'value for normal Objects'
// [[Prototype]]:Object

// bypass -- má pratica (nem tem no repo do Node)
user[Symbol.for("password")] = 123;
assert.deepStrictEqual(user[Symbol.for("password")], 123);

// Well Know Symbols
const obj = {
  // iterators
  [Symbol.iterator]: () => ({
    items: ["c", "b", "a"],
    next() {
      return {
        done: this.items.length === 0,
        // remove o ultimo e retorna
        value: this.items.pop(),
      };
    },
  }),
};
// vai retornar os valores de obj do ultimo para o primeiro
// for (const item of obj) {
//   console.log("item", item);
// }
// Pode ser mostrado com spread operator também
assert.deepStrictEqual([...obj], ["a", "b", "c"]);

const kItems = Symbol("kItems");
class MyDate {
  constructor(...args) {
    this[kItems] = args.map((row) => new Date(...row));
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== "string") throw new TypeError();

    const itens = this[kItems].map((item) =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item)
    );
    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(itens);
  }

  // implementação do iterator, o * no inicio é para validar que é um iterador
  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  // Trabalhando com promises
  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => Promise((r) => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toISOString();
    }
  }

  get [Symbol.toStringTag]() {
    return "WHAT?";
  }
}
const myDate = new MyDate([2020, 03, 01], [2018, 02, 02]);
const expectedDates = [new Date(2020, 03, 01), new Date(2018, 02, 02)];

assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  "[object WHAT?]"
);
// Espera que quando tentamos converter para Number quebre em Error
assert.throws(() => myDate + 1, TypeError());
// Coerção explicita para chamar o toPrimitive
assert.deepStrictEqual(
  String(myDate),
  "01 de abril de 2020 e 02 de março de 2018"
);

// implementar o iterator
assert.deepStrictEqual([...myDate], expectedDates);

(async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates);
})();

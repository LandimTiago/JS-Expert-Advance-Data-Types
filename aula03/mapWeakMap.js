const assert = require("assert");
const myMap = new Map();

// podem conter qualquer coisa
myMap
  .set(1, "one")
  .set("Tiago", { text: "two" })
  .set(true, () => "hello");

// usando um construtor
const myMapWithConstructor = new Map([
  ["1", "str1"],
  [1, "num1"],
  [true, "bool1"],
]);

// console.log("myMap", myMap);
// para pegar o valor de acordo com a chave
// console.log("myMap.get(1)", myMap.get(1));
assert.deepStrictEqual(myMap.get(1), "one");
assert.deepStrictEqual(myMap.get("Tiago"), { text: "two" });

// passamos os parenteses depois para executar a função dentro do valor dessa chave
assert.deepStrictEqual(myMap.get(true)(), "hello");

// Em Objects as chaves so podem ser string ou symbols (number é coergido a string)
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: "TiagoLandim" });

// console.log("get", myMap.get({ id: 1 }));
// se tentarmos chamar assim vai retornar como undefined
// quando setarmos por chave é sempre por referencia
// console.log("get", myMap.get(onlyReferenceWorks));
assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), { name: "TiagoLandim" });

// utilitarios
// no Object seria Object.keys({a: 1}).length
assert.deepStrictEqual(myMap.size, 4);

// para verificar se um item existe no objeto
// item.key = se não existe == undefined
// if() = coerção implicita para boolean e retorna false
// o jeito mais certo em Object seria ({name: 'Tiago}).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWorks));

// para remover um item do objeto
// delete item.id
// imperformatico no JS
assert.ok(myMap.delete(onlyReferenceWorks));

// Não da para iterar em Objects diretamente
// tem que transformar com o Object.entries(item)
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, "one"],
    ["Tiago", { text: "two" }],
    [true, () => {}],
  ])
);
for (const [key, value] of myMap) {
  console.log({ key, value });
}

// O Object não é seguro pois dependendo do nome da chave, podemos substituir algum comportamento padrao
// ({ }).toString() === [object Object]
// ({ toString: ()=> 'Hey' }).toString() === 'Hey'

// qualquer chave pode colidir com as propriedades herdadas do object
// como: toString, valueOf, etc....

const actor = {
  name: "Xuxa",
  toString: "Queen: dos baixinhos",
};
//não tem restrição de nome de chave
myMap.set(actor);

assert.ok(myMap.has(actor));
// Aqui verificamos e o toString não virou propriedade
assert.throws(() => myMap.get(actor).toString, TypeError);

// No Object não temos como limpar o OBJ sem reassina-lo ou passar chave por chave e definilas como undefined
myMap.clear();
assert.deepStrictEqual([...myMap.keys()], []);

// --0----- WeakMap

/**
 * Pode ser coletado apos perder as referencias
 * usado em casos beeeem especificos
 * tem a maioria dos beneficios do Map
 * Mas
 * não é iteravel!!
 *
 * Apenas chaves de referencia e que voce conheça
 * ele é mais leve e preve o leak de memoria, pq depois que as instancias
 * saem da memoria, tudo e limpo
 */

const weakMap = new WeakMap();
const hero = { name: "Batman" };

// contem apenas os 4 metodos a baixo
// weakMap.set(hero);
// weakMap.get(hero);
// weakMap.delete(hero);
// weakMap.has(hero);

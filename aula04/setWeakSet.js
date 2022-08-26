const assert = require("assert");

// usado na maioriua das vezes para listas de itens unicos
const array1 = ["0", "1", "2"];
const array2 = ["2", "0", "3"];
const array3 = array1.concat(array2);

// console.log(array3.sort()); // .sort() para ordernar
assert.deepStrictEqual(array3.sort(), ["0", "0", "1", "2", "2", "3"]);

const set = new Set();
array1.map((item) => set.add(item));
array2.map((item) => set.add(item));
// console.log(Array.from(set));
// o set em si retorna um objeto com os itens listados dentro dos Arrays
// passamos um Array.from(set) para visualizar igual o exemplo anterior
// retorna os itens sem as repetições
assert.deepStrictEqual(Array.from(set), ["0", "1", "2", "3"]);
// podemos também utilizar o spread/rest para definir os itens
// assim temos a mesma definição que foi feita na linha 11 com o "const set = new Set()..."
// e depois realizar a iteração de cada item
assert.deepStrictEqual(Array.from(new Set([...array1, ...array2])), [
  "0",
  "1",
  "2",
  "3",
]);

// dentro do Set temos também as propriedades "keys" e "value" como no map
// console.log("set.keys", set.keys());
// console.log("set.values", set.values()); // Só existe por conta do map

// No array comum, para saber se um item existe
// [].indexOf('1') !== -1 ou [0].includes(0)
// aqui utilizamos o .has()
assert.ok(set.has("3"));

// mesma teoria do Map, mas voce sempre trabalha com a lista toda
// não tem o .get(), então voce pode saber se o item esta ou nao no array e é isso
// na doc tem exemplos sobre como fazer uma interação
// saver o que tem em uma lista e não tem na outra e etc...

// Como saber se tem nos dois arrays ?
const users01 = new Set(["erick", "maria", "joao"]);
const users02 = new Set(["tiago", "erick", "julio"]);

// podemos veririficar a existencia de um usuario em dois arrays sem precisar
// de dois "for" para mapear cada lista, sendo assim, mais peprformatico
// retorna apenas o item existente nas duas listas
const intersection = new Set([...users01].filter((user) => users02.has(user)));
// console.log(Array.from(intersection));
assert.deepStrictEqual(Array.from(intersection), ["erick"]);

// podemos verificar quais itens existem no users01 e não existem no users02
const diference = new Set([...users01].filter((user) => !users02.has(user)));
// console.log(Array.from(diference));
assert.deepStrictEqual(Array.from(diference), ["maria", "joao"]);

/// --------WeakSet

// segue a mesma ideia do weakMap
// nao e enumeravel (iteravel)
// so trabalha com chaves como referencias

const user1 = { id: 132 };
const user2 = { id: 321 };
const weakSet = new WeakSet([user1]);
// existem apenas 3 funções, parecido com o weakMap
// weakSet.add(user2);
// weakSet.delete(user2);
// weakSet.has(user2);

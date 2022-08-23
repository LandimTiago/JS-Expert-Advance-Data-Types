const assert = require("assert");

function* calculate(arg1, arg2) {
  yield arg1 * arg2;
}

function* main() {
  yield "Hello";
  yield "-";
  yield "World";

  // NOTE se não passarmos o * junto ao yield o JS não entende
  // que precisamos executar essa função e apenas retorna ela.
  yield* calculate(20, 10);
}

const generator = main();
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());
// console.log(generator.next());

assert.deepStrictEqual(generator.next(), { value: "Hello", done: false });
assert.deepStrictEqual(generator.next(), { value: "-", done: false });
assert.deepStrictEqual(generator.next(), { value: "World", done: false });
assert.deepStrictEqual(generator.next(), { value: 200, done: false });
// NOTE quando o retorno de value é undefined e o done true significa que terminamos de executar nossa fila de execuções
// e tivemos o retorno de todos os valores por isso retorna true como terminado
assert.deepStrictEqual(generator.next(), { value: undefined, done: true });

// ___________________________
// RETORNA O ARRAY A PARTIR DO GENERATOR
// console.log("Array.from", Array.from(main()));
assert.deepStrictEqual(Array.from(main()), ["Hello", "-", "World", 200]);
assert.deepStrictEqual([...main()], ["Hello", "-", "World", 200]);

// ------ Async iterators
const { readFile, stat, readdir } = require("fs/promises");

// function* promisified() {
//   yield readFile(__filename);
//   yield Promise.resolve("Hey Dude");
// }
// Promise.all([...promisified()]).then((result) =>
//   console.log("primisefied", result)
// );
// Assim ele entende que deve resolver todas as promises e retornar o valor como Buffer

// (async () => {
//   for await (const item of promisified()) {
//     console.log("For await", item.toString());
//     // com item.toString() convertemos o Buffer para strings
//   }
// })();

async function* systemInfo() {
  const file = await readFile(__filename);
  yield { file: file.toString() };
  // para ler o arquivo por inteiro

  const { size } = await stat(__filename);
  yield { size };
  // para saber os status do arquivo/
  // nesse caso o tamanho do arquivo

  const dir = await readdir(__dirname);
  yield { dir };
  // para saber todos os arquivos no diretorio
}
(async () => {
  for await (const item of systemInfo()) {
    console.log("systemInfo", item);
    // com item.toString() convertemos o Buffer para strings
  }
})();

"use strict";
const Event = require("events");
const event = new Event();
const eventName = "counter";

event.on(eventName, (msg) => console.log("counter updated", msg));
// .emit() para disparar o evento
// event.emit(eventName, "oi");
// event.emit(eventName, "tchau");

// Vamos criar um proxy
const myCounter = {
  counter: 0,
};
// passamos então o objeto a ser observado (myCounter)
// criamos a função
const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] });
    target[propertyKey] = newValue;
    return true;
  },

  get: (object, prop) => {
    // console.log("chamou", { object, prop });
    return object[prop];
  },
});

// jaja e sempre
setInterval(function () {
  proxy.counter += 1;
  if (proxy.counter === 10) clearInterval(this);
  console.log("[3]: setInterval");
}, 2000);

// futuro
setTimeout(() => {
  proxy.counter = 4;
  console.log("[2]: timeout");
}, 100);

// se queremos executar imediatamente, melhor usar o setImediate
setImmediate(() => {
  console.log("[1]: setImediate", proxy.counter);
});

// Para executar agora, acabando com o clico de vida do node
process.nextTick(() => {
  proxy.counter = 2;
  console.log("[0]: nexTick");
});
// vai executar normalmente mas começando a partir do 2 como definido pelo nextTick

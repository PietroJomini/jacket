import { Server, Router, types, controller, ensure } from "../mod.ts";

const server = new Server();
const router = new Router();

const schema = types.object({
  name: types.string,
  age: types.string2number,
});

router.get(
  "/",
  controller(schema)
    .use(({ query }) => console.log(query))
    .use(({ query: { age } }) => ensure(age >= 18, { msg: `!(${age} > 18)` }))
    .use(({ query: { name, age } }) => name + " " + age),
);

server.route(router);
server.listen({ port: 3000 });

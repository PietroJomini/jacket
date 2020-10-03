import {
  Server,
  Router,
  types,
  ensure,
  Controller,
  Group,
} from "../mod.ts";

const server = new Server();
const router = new Router();

const schema = types.object({
  name: types.string,
  age: types.string2number,
});

const g = new Group<typeof schema>("validate age")
  .use(({ query: { age } }) => age >= 18)
  .use(({ payload }) => ensure(payload, { msg: "age must be > 18" }));

const c = new Controller(schema)
  .use(({ query }) => console.log(query))
  .use(g)
  .endpoint(({ query: { age, name } }) => `${name} is ${age} yo`);

router.get("/", c);

server.route(router);
server.listen({ port: 3000 });

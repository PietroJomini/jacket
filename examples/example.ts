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
  age: types.number.transform((V) => Number(V)).verify((V) => !isNaN(V)),
  nov: types.null,
  alive: types.boolean,
  someday: types.date,
  tags: types.array.of(types.string),
  tags2: types.array.of(types.array.of(types.boolean)),
});

const c = new Controller(schema).endpoint(({ query: { age, name } }) =>
  `${name} is ${age} yo`
);

const g = Group.for(c, "validate age")
  .use(({ query: { age } }) => age >= 18)
  .use(({ payload }) => ensure(payload, { msg: "age must be > 18" }));

c.use(({ query }) => console.log(query)).use(g);

router.get("/", c);

server.route(router);
server.listen({ port: 3000 });

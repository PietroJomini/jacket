import { Status, Context } from "../../deps.ts";

export default async (
  { response }: Context,
  next: any,
) => {
  try {
    await next();
  } catch (err) {
    const status = err.status || err.statusCode || Status.InternalServerError;
    console.log(err); // TODO better error handling

    response.status = status;
    response.body = { status, message: err.message };
  }
};

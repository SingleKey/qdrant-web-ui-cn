import { validate } from "jtd";
import schema from "./collection-schema.jtd.json";

export function validateFormOutput(data) {
  if (data.sparse_vectors && data.sparse_vectors.length > 0) {
    if (
      !data.sparse_vectors.every(
        (vector) => vector.name && vector.name.trim() !== "",
      )
    ) {
      throw new Error("Every sparse vector must have a non-empty name");
    }
  }

  const errors = validate(schema, data);
  if (errors.length > 0) {
    throw new Error(`Invalid form output: ${JSON.stringify(errors, null, 2)}`);
  }
  return data;
}

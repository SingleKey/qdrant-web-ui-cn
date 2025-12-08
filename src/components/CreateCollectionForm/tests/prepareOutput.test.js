import { describe, expect, it } from "vitest";
import { prepareOutput, stepExtractors } from "../prepareOutput";
import { steps } from "../flow";

export const exampleState = {
  "use-case-step": "global-search",
  "tenant-field-selection-step": {
    completed: true,
    tenant_id: "user-id",
  },
  "templates-selection-step": "custom",
  "custom-collection-dense-step": {
    completed: true,
    custom_dense_vectors: [
      {
        advanced_config: {
          completed: true,
        },
        vector_config: {
          completed: true,
          dimensions: 512,
        },
        vector_name: "dense1",
        completed: true,
      },
      {
        advanced_config: {
          completed: true,
        },
        vector_name: "dense2",
        vector_config: {
          dimensions: 3072,
          completed: true,
          metric: "Dot",
        },
        completed: true,
      },
    ],
  },
  "custom-collection-sparse-step": {
    completed: true,
    custom_sparse_vectors: [
      {
        vector_config: {
          completed: true,
          use_idf: true,
        },
        vector_name: "sparse1",
        completed: true,
      },
      {
        vector_config: {
          completed: true,
        },
        vector_name: "sparse2",
        completed: true,
      },
    ],
  },
  "index-field-selection-step": {
    completed: true,
    payload_fields: [
      {
        field_name: "user-id",
        field_config: {
          field_config_enum: "keyword",
          parentCompleted: true,
          completed: true,
        },
        completed: true,
      },
      {
        field_name: "test-field",
        field_config: {
          field_config_enum: "text",
          parentCompleted: true,
          completed: true,
          range: false,
        },
        completed: true,
      },
      {
        field_name: "org-id",
        field_config: {
          field_config_enum: "integer",
          parentCompleted: true,
          completed: true,
          range: false,
        },
        completed: true,
      },
    ],
  },
  "simple-hybrid-embedding-step": {
    completed: true,
    sparse_vector_config_group: {
      completed: true,
      sparse_vector_config: {
        completed: true,
      },
      sparse_vector_name: "title-sparse",
    },
    vector_config_group: {
      completed: true,
      dense_vector_config: {
        completed: true,
        dimensions: 512,
      },
      dense_vector_name: "title-dense",
    },
  },
  "simple-dense-embedding-step": {
    completed: true,
    vector_config_group: {
      completed: true,
      vector_config: {
        completed: true,
        dimensions: 512,
        metric: "Euclid",
      },
    },
  },
};

describe("Convert form data into usable format", () => {
  it("all steps should have registered extractor", () => {
    let allStepsKeys = Object.keys(steps);
    let handledSteps = Object.keys(stepExtractors);
    allStepsKeys.forEach((step) => {
      expect(handledSteps).toContain(step);
    });
  });

  it("should convert example data with simple steps", () => {
    let output = prepareOutput(exampleState, [
      "simple-dense-embedding-step",
      "index-field-selection-step",
    ]);

    // Assert that there is one dense vector

    expect(output.dense_vectors).toHaveLength(1);
    expect(output.dense_vectors[0].size).toBe(512);
    expect(output.dense_vectors[0].distance).toBe("Euclid");

    // Assert the are 3 payload indexes

    expect(output.payload_indexes).toHaveLength(3);
    expect(output.payload_indexes[0].name).toBe("user-id");
    expect(output.payload_indexes[0].type).toBe("keyword");
    expect(output.payload_indexes[1].name).toBe("test-field");
    expect(output.payload_indexes[1].type).toBe("text");
    expect(output.payload_indexes[2].name).toBe("org-id");
    expect(output.payload_indexes[2].type).toBe("integer");
  });

  it("Should convert custom collection dense step", () => {
    let output = prepareOutput(exampleState, ["custom-collection-dense-step"]);

    // Assert that there are 2 dense vectors

    expect(output.dense_vectors).toHaveLength(2);
    expect(output.dense_vectors[0].size).toBe(512);
    expect(output.dense_vectors[1].size).toBe(3072);
    expect(output.dense_vectors[1].distance).toBe("Dot");
  });

  it("Should convert custom sparse vectors and tenant field", () => {
    let output = prepareOutput(exampleState, [
      "custom-collection-sparse-step",
      "tenant-field-selection-step",
    ]);

    // Assert that there are 2 sparse vectors

    expect(output.sparse_vectors).toHaveLength(2);
    expect(output.sparse_vectors[0].use_idf).toBe(true);
    expect(output.sparse_vectors[1].use_idf).toBe(false);

    // Assert tenant field

    expect(output.tenant_field.name).toBe("user-id");
    expect(output.tenant_field.type).toBe("keyword");
  });
});

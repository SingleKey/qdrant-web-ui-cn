import { validateFormOutput } from "./validateOutput";

// / Function to convert form state into usable output
// / formState: object containing each step's form data
// / steps: array of step objects
// / Example output:
// let exampleResult = {
//     "collection_name": "example-collection",
//     "tenant_field": {
//         "name": "user-id",
//         "type": "keyword"
//     },
//     "dense_vectors": [
//         {
//             "name": "dense1",
//             "size": 512,
//             "distance": "Euclid",
//             "multivector": false,
//             "storage_tier": "balanced",
//             "precision_tier": "high"
//         }
//     ],
//     "sparse_vectors": [
//         {
//             "name": "sparse1",
//             "use_idf": true,
//             "storage_tier": "balanced",
//             "precision_tier": "high"
//         }
//     ],
//     "payload_indexes": [
//         {
//             "name": "user-id",
//             "type": "keyword"
//         },
//         {
//             "name": "test-field",
//             "type": "text",
//             "params": {
//                 "lowercase": true,
//                 "tokenizer": "whitespace",
//                 "min_token_length": null,
//                 "max_token_length": null,
//                 "phrase_matching": true
//             }
//         },
//         {
//             "name": "org-id",
//             "type": "integer",
//             "params": {
//                 "range": false,
//                 "lookup": true
//             }
//         }
//     ],
// }

function emptyExtractor(data, stepData) {}

function collectionNameExtractor(data, stepData) {
  data.collection_name = stepData?.collection_name;
}

function tenantFieldExtractor(data, stepData) {
  data.tenant_field = {
    name: stepData.tenant_id,
    type: "keyword",
  };
}

function simpleDenseEmbeddingExtractor(data, stepData) {
  /**
   * Example stepData:
   *
   * "simple-dense-embedding-step": {
   *     "completed": true,
   *     "vector_config_group": {
   *         "completed": true,
   *         "vector_config": {
   *             "completed": true,
   *             "dimensions": 512,
   *             "metric": "Euclid"
   *         }
   *     }
   * }
   */

  const size = stepData?.vector_config_group?.vector_config?.dimensions;
  const distance =
    stepData?.vector_config_group?.vector_config?.metric || "Cosine";

  data.dense_vectors = [
    {
      name: "", // Anonymous dense vector have empty name
      size: size,
      distance: distance,
      multivector: false,
      storage_tier: "balanced",
      precision_tier: "high",
    },
  ];
}

function simpleHybridEmbeddingExtractor(data, stepData) {
  /**
   * Example stepData:
   *
   * "simple-hybrid-embedding-step": {
   *     "completed": true,
   *     "sparse_vector_config_group": {
   *         "completed": true,
   *         "sparse_vector_config": {
   *             "completed": true
   *         },
   *         "sparse_vector_name": "title-sparse"
   *     },
   *     "vector_config_group": {
   *         "completed": true,
   *         "dense_vector_config": {
   *             "completed": true,
   *             "dimensions": 512
   *         },
   *         "dense_vector_name": "title-dense"
   *     }
   * },
   */

  const denseName = stepData?.vector_config_group?.dense_vector_name;
  const denseSize =
    stepData?.vector_config_group?.dense_vector_config?.dimensions;
  const denseDistance =
    stepData?.vector_config_group?.dense_vector_config?.metric || "Cosine";

  const sparseName = stepData?.sparse_vector_config_group?.sparse_vector_name;
  const use_idf =
    stepData?.sparse_vector_config_group?.sparse_vector_config?.use_idf ||
    false;

  data.dense_vectors = [
    {
      name: denseName,
      size: denseSize,
      distance: denseDistance,
      multivector: false,
      storage_tier: "balanced",
      precision_tier: "high",
    },
  ];

  data.sparse_vectors = [
    {
      name: sparseName,
      use_idf: use_idf,
      storage_tier: "balanced",
      precision_tier: "high",
    },
  ];
}

function customCollectionDenseExtractor(data, stepData) {
  /**
   * Example stepData:
   * "custom-collection-dense-step": {
   *         "completed": true,
   *         "custom_dense_vectors": [
   *             {
   *                 "advanced_config": {
   *                     "completed": true
   *                 },
   *                 "vector_config": {
   *                     "completed": true,
   *                     "dimensions": 512
   *                 },
   *                 "vector_name": "dense1",
   *                 "completed": true
   *             },
   *             {
   *                 "advanced_config": {
   *                     "completed": true
   *                 },
   *                 "vector_name": "dense2",
   *                 "vector_config": {
   *                     "dimensions": 3072,
   *                     "completed": true,
   *                     "metric": "Dot"
   *                 },
   *                 "completed": true
   *             }
   *         ]
   *     },
   */

  if (!stepData?.custom_dense_vectors) {
    data.dense_vectors = [];
    return;
  }

  data.dense_vectors = stepData.custom_dense_vectors.map((vector) => {
    return {
      name: vector.vector_name,
      size: vector.vector_config.dimensions,
      distance: vector.vector_config.metric || "Cosine",
      multivector: vector?.advanced_config?.multivector || false,
      storage_tier: vector?.advanced_config?.storage_tier || "balanced",
      precision_tier: vector?.advanced_config?.precision_tier || "high",
    };
  });
}

function customCollectionSparseExtractor(data, stepData) {
  /**
   * Example stepData:
   * "custom-collection-sparse-step": {
   *     "completed": true,
   *     "custom_sparse_vectors": [
   *         {
   *             "vector_config": {
   *                 "completed": true,
   *                 "use_idf": true
   *             },
   *             "vector_name": "sparse1",
   *             "completed": true
   *         },
   *         {
   *             "vector_config": {
   *                 "completed": true
   *             },
   *             "vector_name": "sparse2",
   *             "completed": true
   *         }
   *     ]
   * },
   */
  if (!stepData?.custom_sparse_vectors) {
    data.sparse_vectors = [];
    return;
  }

  data.sparse_vectors = stepData.custom_sparse_vectors.map((vector) => {
    return {
      name: vector.vector_name,
      use_idf: vector?.vector_config?.use_idf ?? false,
      storage_tier: vector?.advanced_config?.storage_tier || "balanced",
      precision_tier: vector?.advanced_config?.precision_tier || "high",
    };
  });
}

function indexFieldSelectionExtractor(data, stepData) {
  /**
   * Example stepData:
   *
   * "index-field-selection-step": {
   *     "completed": true,
   *     "payload_fields": [
   *         {
   *             "field_name": "user-id",
   *             "field_config": {
   *                 "field_config_enum": "keyword",
   *                 "parentCompleted": true,
   *                 "completed": true
   *             },
   *             "completed": true
   *         },
   *         {
   *             "field_name": "test-field",
   *             "field_config": {
   *                 "field_config_enum": "text",
   *                 "parentCompleted": true,
   *                 "completed": true,
   *                 "range": false
   *             },
   *             "completed": true
   *         },
   *         {
   *             "field_name": "org-id",
   *             "field_config": {
   *                 "field_config_enum": "integer",
   *                 "parentCompleted": true,
   *                 "completed": true,
   *                 "range": false
   *             },
   *             "completed": true
   *         }
   *     ]
   * },
   */
  if (!stepData?.payload_fields) {
    data.payload_indexes = [];
    return;
  }

  data.payload_indexes = stepData.payload_fields.map((field) => {
    const params = {};
    if (field.field_config.field_config_enum === "text") {
      params.lowercase = field.field_config?.lowercase ?? true;
      params.tokenizer = field.field_config?.tokenizer || "whitespace";
      params.phrase_matching = field.field_config?.phrase_matching ?? true;

      const minLength = field.field_config?.min_token_length;
      const maxLength = field.field_config?.max_token_length;

      if (minLength !== undefined && minLength !== "") {
        const value =
          typeof minLength === "number" ? minLength : parseInt(minLength, 10);
        if (!isNaN(value) && value >= 0) {
          params.min_token_length = value;
        }
      }

      if (maxLength !== undefined && maxLength !== "") {
        const value =
          typeof maxLength === "number" ? maxLength : parseInt(maxLength, 10);
        if (!isNaN(value) && value >= 0) {
          params.max_token_length = value;
        }
      }
    } else if (field.field_config.field_config_enum === "integer") {
      params.range = field.field_config?.range ?? true;
      params.lookup = field.field_config?.lookup ?? true;
    }

    return {
      name: field.field_name,
      type: field.field_config.field_config_enum,
      params: params,
    };
  });
}

export const stepExtractors = {
  "collection-name-step": collectionNameExtractor,
  "use-case-step": emptyExtractor,
  "tenant-field-selection-step": tenantFieldExtractor,
  "templates-selection-step": emptyExtractor,
  "simple-dense-embedding-step": simpleDenseEmbeddingExtractor,
  "simple-hybrid-embedding-step": simpleHybridEmbeddingExtractor,
  "custom-collection-dense-step": customCollectionDenseExtractor,
  "custom-collection-sparse-step": customCollectionSparseExtractor,
  "index-field-selection-step": indexFieldSelectionExtractor,
};

export function prepareOutput(formState, path) {
  const output = {};

  (path || []).forEach((step) => {
    const stepData = formState[step];
    if (stepExtractors[step]) {
      stepExtractors[step](output, stepData);
    }
  });

  return validateFormOutput(output);
}

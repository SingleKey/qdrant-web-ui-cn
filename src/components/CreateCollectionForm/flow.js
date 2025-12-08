// This file contains a definition of a form flow.
// It contains a list of steps and a list of transitions, with the description of the steps.
export const elements = {
  "dense-vector-configuration": {
    elements: [
      {
        type: "number-with-suggestions",
        title: "选择维度",
        name: "dimensions",
        required: true,
        suggestions: [
          {
            label: "CLIP",
            value: 512,
          },
          {
            label: "openai-ai/text-embedding-3-small",
            value: 1536,
          },
          {
            label: "openai-ai/text-embedding-3-large",
            value: 3072,
          },
        ],
      },
      {
        type: "dropdown",
        name: "metric",
        options: ["余弦相似度（Cosine）", "欧几里得距离（Euclid）", "点积（Dot）", "曼哈顿距离（Manhattan）"],
        default: "Cosine",
        title: "选择相似度度量方式",
      },
    ],
  },
  "sparse-vector-configuration": {
    elements: [
      {
        type: "checkbox",
        title: "启用 IDF？",
        name: "use_idf",
        default: false,
        required: false,
        description:
          "此选项启用逆文档频率（IDF）加权。<br>若您使用 BM25 或其他依赖 IDF 的模型，请开启。",
        link: "https://qdrant.tech/documentation/concepts/indexing/#idf-modifier",
        linkText: "了解更多",
        size: 12,
      },
    ],
  },
};

// ToDo: Each step except for the last one should have "continue-step".
// If it doesn't have "continue-step", that means we should add one.
export const steps = {
  "collection-name-step": {
    title: "命名您的集合",
    useCard: true,
    elements: [
      {
        type: "string-input",
        name: "collection_name",
        placeholder: "示例：my-collection",
        description:
          "集合名称必须唯一，仅允许字母、数字、连字符（-）和下划线（_）",
        required: true,
        size: 12,
        setFocus: true,
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "use-case-step",
      },
    },
  },
  "use-case-step": {
    title: "您的使用场景是什么？",
    cards: [
      {
        title: "全局搜索",
        icon: { /* SVG path 保持不变 */ },
        size: 6,
        "short-description": "在整个集合中进行搜索",
        description:
          "在整个数据集合中进行搜索，支持可选过滤条件。例如：<ul><li>电商平台商品搜索</li><li>全站内容检索</li></ul>",
        name: "global-search",
        "on-select": {
          "continue-step": "templates-selection-step",
        },
      },
      {
        title: "多租户",
        icon: { /* SVG path 保持不变 */ },
        size: 6,
        "short-description": "多租户，数据隔离",
        description:
          "在多个逻辑隔离的租户中进行独立搜索。例如：<ul><li>用户个人文档搜索</li><li>聊天记录按用户隔离检索</li><li>企业级组织数据隔离</li></ul>",
        name: "multitenancy",
        "on-select": {
          "continue-step": "tenant-field-selection-step",
        },
      },
    ],
  },
  "tenant-field-selection-step": {
    title: "租户字段",
    description: "哪个 payload 字段将用作租户 ID？",
    "long-description":
      "此字段用于按租户 ID 过滤数据。例如：`user_id`、`organization_id` 等。该字段类型应为 `keyword`。",
    useCard: true,
    elements: [
      {
        size: 12,
        type: "string-input",
        title: "租户字段名称",
        name: "tenant_id",
        placeholder: "示例：user_id",
        required: true,
        setFocus: true,
      },
      {
        size: 12,
        type: "description",
        description:
          "此 payload 字段用于在集合内划分租户边界。<br>系统将自动为其创建类型为 `keyword` 的特殊索引（`is_tenant=true`）。<br>所有查询请求必须包含该字段作为过滤条件。",
        name: "tenant_id_description",
        link: "https://qdrant.tech/documentation/guides/multiple-partitions/",
        linkText: "多租户配置文档",
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "templates-selection-step",
      },
    },
  },
  "templates-selection-step": {
    title: "您希望使用哪种搜索方式？",
    description:
      "以下是一些常用方案，您可直接选用，或自定义配置：",
    cards: [
      {
        title: "单嵌入向量（Simple）",
        description:
          "最简配置：每条记录仅含一个向量字段。",
        name: "simple-single-embedding",
        "on-select": {
          "continue-step": "simple-dense-embedding-step",
        },
        size: 4,
      },
      {
        title: "混合搜索（Hybrid）",
        description:
          "同时使用密集向量（语义）与稀疏向量（关键词）进行搜索，结果融合排序。",
        name: "simple-hybrid-search",
        "on-select": {
          "continue-step": "simple-hybrid-embedding-step",
        },
        size: 4,
      },
      {
        title: "自定义配置",
        description: "自由组合向量类型、索引策略等高级选项。",
        name: "custom",
        "on-select": {
          "continue-step": "custom-collection-dense-step",
        },
        size: 4,
      },
    ],
  },
  "simple-dense-embedding-step": {
    title: "向量配置",
    description: "密集向量参数设置",
    elements: [
      {
        type: "group",
        name: "vector_config_group",
        required: true,
        elements: [
          {
            type: "dense-vector-configuration",
            name: "vector_config",
            required: true,
          },
        ],
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "index-field-selection-step",
      },
    },
  },
  "simple-hybrid-embedding-step": {
    title: "向量配置",
    description: "密集向量与稀疏向量联合配置",
    elements: [
      {
        type: "group",
        name: "vector_config_group",
        required: true,
        elements: [
          {
            type: "string-input",
            title: "密集向量名称",
            name: "dense_vector_name",
            variant: "outlined",
            placeholder: "示例：text-dense",
            description: "用于存储密集嵌入的字段名",
            link: "https://qdrant.tech/documentation/concepts/vectors/#named-vectors",
            size: 12,
            required: true,
            setFocus: true,
          },
          {
            type: "dense-vector-configuration",
            name: "dense_vector_config",
            required: true,
          },
        ],
      },
      {
        type: "group",
        name: "sparse_vector_config_group",
        required: true,
        elements: [
          {
            type: "string-input",
            title: "稀疏向量名称",
            name: "sparse_vector_name",
            variant: "outlined",
            placeholder: "示例：text-sparse",
            description: "用于存储稀疏嵌入的字段名",
            link: "https://qdrant.tech/documentation/concepts/vectors/#named-vectors",
            size: 12,
            required: true,
          },
          {
            type: "sparse-vector-configuration",
            name: "sparse_vector_config",
            required: true,
          },
        ],
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "index-field-selection-step",
      },
    },
  },
  "custom-collection-dense-step": {
    title: "自定义集合 — 密集向量",
    description: "为集合配置一个或多个密集向量",
    elements: [
      {
        type: "repeatable",
        name: "custom_dense_vectors",
        maxRepetitions: 3,
        elements: [
          {
            type: "string-input",
            title: "向量名称",
            name: "vector_name",
            variant: "outlined",
            placeholder: "示例：image-embedding",
            description: "该名称将作为向量字段标识",
            size: 12,
            required: true,
            setFocus: true,
          },
          {
            type: "dense-vector-configuration",
            name: "vector_config",
            required: true,
          },
          {
            type: "details",
            name: "advanced_config",
            title: "高级配置",
            elements: [
              {
                type: "checkbox",
                title: "多向量（Multi-vector）",
                name: "multivector",
                default: false,
                size: 6,
              },
              {
                type: "description",
                description:
                  "为单个点存储多个子向量。<br>若使用 ColBERT、ColPali 等晚期交互（late-interaction）模型，请启用此选项。",
                name: "multivector_description",
                link: "https://qdrant.tech/documentation/concepts/vectors/#multivectors",
                linkText: "了解更多",
                size: 6,
              },
              {
                type: "enum-slider",
                title: "存储层级",
                name: "storage_tier",
                options: ["容量优先", "均衡", "性能优先"],
                defaultValue: "balanced",
                size: 6,
              },
              {
                type: "description",
                description:
                  "定义向量的存储策略。<br>「容量优先」适合高数据量、低频访问；「性能优先」优化低延迟响应。",
                name: "storage_tier_description",
                size: 6,
              },
              {
                type: "enum-slider",
                title: "精度层级",
                name: "precision_tier",
                options: ["低", "中", "高"],
                defaultValue: "high",
                size: 6,
              },
              {
                type: "description",
                description:
                  "控制向量压缩策略。<br>「低」启用量化（如 uint8）以节省内存；「高」保留原始精度（float32）。",
                name: "precision_tier_description",
                size: 6,
              },
            ],
          },
        ],
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "custom-collection-sparse-step",
      },
    },
  },
  "custom-collection-sparse-step": {
    title: "自定义集合 — 稀疏向量",
    description: "为集合配置一个或多个稀疏向量",
    elements: [
      {
        type: "repeatable",
        name: "custom_sparse_vectors",
        maxRepetitions: 3,
        elements: [
          {
            type: "string-input",
            title: "向量名称",
            name: "vector_name",
            placeholder: "示例：keyword-sparse",
            size: 12,
            required: true,
            setFocus: true,
          },
          {
            type: "sparse-vector-configuration",
            name: "vector_config",
            required: false,
          },
        ],
      },
    ],
    button: {
      type: "button",
      title: "继续",
      "on-click": {
        "continue-step": "index-field-selection-step",
      },
    },
  },
  "index-field-selection-step": {
    title: "Payload 索引配置",
    description: "若需基于 payload 字段进行高效过滤，建议为关键字段创建索引。",
    finish: true,
    elements: [
      {
        type: "repeatable",
        name: "payload_fields",
        maxRepetitions: 10,
        elements: [
          {
            type: "string-input",
            title: "字段名称",
            name: "field_name",
            placeholder: "示例：category",
            size: 12,
            required: true,
            setFocus: true,
          },
          {
            type: "button-group-with-inputs",
            title: "字段类型与索引参数",
            name: "field_config",
            required: true,
            size: 12,
            enums: [
              {
                name: "keyword",
                fields: [
                  {
                    type: "description",
                    description:
                      '关键词索引，适用于字符串的精确匹配（大小写敏感）。<br><br> 示例：<code>color: "red"</code><br><br> 文档：',
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#keyword",
                    size: 12,
                  },
                ],
              },
              {
                name: "integer",
                fields: [
                  {
                    type: "description",
                    description:
                      "整型索引，支持精确匹配与范围查询。<br><br> 示例：<code>age: 25</code> 或 <code>age ≥ 18</code><br><br> 文档：",
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#integer",
                    size: 12,
                  },
                  {
                    title: "支持精确匹配",
                    name: "lookup",
                    type: "checkbox",
                    default: true,
                    size: 3,
                  },
                  {
                    type: "description",
                    description:
                      "启用后可加速 <code>field = value</code> 类查询，但会增加内存占用。",
                    link: "https://qdrant.tech/documentation/concepts/indexing/#parameterized-index",
                    linkText: "了解更多",
                    name: "lookup_description",
                    size: 9,
                  },
                  {
                    title: "支持范围查询",
                    name: "range",
                    type: "checkbox",
                    default: true,
                    size: 3,
                  },
                  {
                    type: "description",
                    description:
                      "启用后可加速 <code>field ≥ value</code> 类查询，但会增加内存占用。",
                    link: "https://qdrant.tech/documentation/concepts/indexing/#parameterized-index",
                    linkText: "了解更多",
                    name: "range_description",
                    size: 9,
                  },
                ],
              },
              {
                name: "float",
                fields: [
                  {
                    type: "description",
                    description:
                      "浮点数索引，支持范围查询（也适用于整数）。<br><br> 示例：<code>price: 99.5</code> 或 <code>score > 0.8</code><br><br> 文档：",
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#float",
                    size: 12,
                  },
                ],
              },
              {
                name: "uuid",
                fields: [
                  {
                    type: "description",
                    description:
                      'UUID 索引，优化版 keyword 索引，专用于 UUID 值匹配。<br><br> 示例：<code>doc_id: "123e4567-e89b-12d3-a456-426614174000"</code><br><br> 文档：',
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#uuid",
                    size: 12,
                  },
                ],
              },
              {
                name: "datetime",
                fields: [
                  {
                    type: "description",
                    description:
                      '时间索引，支持按时间范围过滤。<br><br> 示例：<code>created_at: "2023-02-08T10:49:00Z"</code><br><br> 文档：',
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#datetime",
                    size: 12,
                  },
                ],
              },
              {
                name: "text",
                fields: [
                  {
                    type: "description",
                    description:
                      '全文检索索引，支持关键词、短语匹配等。<br><br> 示例：<code>title: "人工智能"</code><br><br> 文档：',
                    linkText: "全文检索文档",
                    link: "https://qdrant.tech/documentation/concepts/filtering/#full-text-match",
                    size: 12,
                  },
                  {
                    title: "分词器",
                    name: "tokenizer",
                    type: "dropdown",
                    options: ["前缀（prefix）", "空格（whitespace）", "单词（word）", "多语言（multilingual）"],
                    description: "定义文本如何切分为词条",
                    link: "https://qdrant.tech/documentation/concepts/indexing/#full-text-index",
                    linkText: "了解更多",
                    default: "whitespace",
                    size: 12,
                  },
                  {
                    title: "小写归一",
                    name: "lowercase",
                    type: "checkbox",
                    default: true,
                    description: "将文本统一转为小写，提升匹配鲁棒性",
                    link: "https://qdrant.tech/documentation/concepts/indexing/#full-text-index",
                    linkText: "了解更多",
                    size: 6,
                  },
                  {
                    title: "短语匹配",
                    name: "phrase_matching",
                    type: "checkbox",
                    default: true,
                    description: "支持引号短语精确匹配（如 <code>\"machine learning\"</code>），需额外索引空间",
                    link: "https://qdrant.tech/documentation/concepts/filtering/#phrase-matching",
                    linkText: "了解更多",
                    size: 6,
                  },
                  {
                    title: "最小词条长度",
                    name: "min_token_len",
                    type: "number",
                    min: 1,
                  },
                  {
                    title: "最大词条长度",
                    name: "max_token_len",
                    type: "number",
                    min: 1,
                  },
                ],
              },
              {
                name: "geo",
                fields: [
                  {
                    type: "description",
                    description:
                      '地理坐标索引，支持经纬度范围与半径查询。<br><br> 示例：<code>location: { "lon": 52.5200, "lat": 13.4050 }</code><br><br> 文档：',
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#geo",
                    size: 12,
                  },
                ],
              },
              {
                name: "bool",
                fields: [
                  {
                    type: "description",
                    description:
                      "布尔索引，支持 true/false 精确匹配。<br><br> 示例：<code>is_published: true</code><br><br> 文档：",
                    linkText: "了解更多",
                    link: "https://qdrant.tech/documentation/concepts/payload/#bool",
                    size: 12,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
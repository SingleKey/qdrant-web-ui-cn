/* eslint-disable no-restricted-globals */
import * as druid from '@saehrimnir/druidjs';
import get from 'lodash/get';

const MESSAGE_INTERVAL = 200;
const DEFAULT_ALGORITHM = 'UMAP';

function getVectorType(vector) {
  if (Array.isArray(vector)) {
    if (Array.isArray(vector[0])) {
      return 'multivector';
    }
    return 'vector';
  }
  if (typeof vector === 'object') {
    if (vector.indices) {
      return 'sparse';
    }
    return 'named';
  }
  return 'unknown';
}

self.onmessage = function (e) {
  let now = new Date().getTime();

  const params = e?.data?.params || {};

  const algorithm = params.algorithm || DEFAULT_ALGORITHM;

  const data = [];

  const points = e.data?.result?.points;
  const vectorName = params.using;

  if (!points || points.length === 0) {
    self.postMessage({
      data: [],
      error: '未找到数据',
    });
    return;
  }

  if (points.length === 1) {
    self.postMessage({
      data: [],
      error: `无法对单个向量点执行 ${params.algorithm || DEFAULT_ALGORITHM} 算法`,
    });
    return;
  }

  for (let i = 0; i < points.length; i++) {
    if (!vectorName) {
      // Work with default vector
      data.push(points[i]?.vector);
    } else {
      // Work with named vector
      data.push(get(points[i]?.vector, vectorName));
    }
  }

  // Validate data

  for (let i = 0; i < data.length; i++) {
    const vector = data[i];
    const vectorType = getVectorType(vector);

    if (vectorType === 'vector') {
      continue;
    }

    if (vectorType === 'named') {
      self.postMessage({
        data: [],
        error: '请通过 `using` 参数选择一个有效的向量名称，默认向量未定义',
      });
      return;
    }

    self.postMessage({
      data: [],
      error: '不支持 "' + vectorType + '" 类型向量的可视化',
    });
    return;
  }

  if (data.length) {
    if (algorithm === 'PCA') {
      const D = new druid[algorithm](data, {});
      const transformedData = D.transform();

      self.postMessage({ result: getDataset(transformedData), error: null });
    } else {
      const D = new druid[algorithm](data, {}); // ex  params = { perplexity : 50,epsilon :5}
      const next = D.generator(); // default = 500 iterations

      let reducedPoints = [];
      for (reducedPoints of next) {
        if (Date.now() - now > MESSAGE_INTERVAL) {
          now = Date.now();
          self.postMessage({ result: getDataset(reducedPoints), error: null });
        }
      }
      self.postMessage({ result: getDataset(reducedPoints), error: null });
    }
  }
};

function getDataset(reducedPoints) {
  // Convert [[x1, y1], [x2, y2] ] to [ { x: x1, y: y1 }, { x: x2, y: y2 } ]
  return reducedPoints.map((point) => ({ x: point[0], y: point[1] }));
}

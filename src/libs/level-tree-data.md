# levelTreeData

## 前言

我想要做的是抽离业务代码中的同一类纯逻辑问题，把这些问题汇聚到模型上去做处理
期望模型降低纯逻辑功能的开发难度，提高业务代码可测性

### 设计思路

#### 需求描述

输入一个平铺的树型数据
期望平铺的树型数据的id, parentId的关系放在一个二维数组里，生成当前节点下所有子节点的值域treeDataValueRange。
通过treeDataValueRange获取其下的所有子树对应的levelTreeData

#### 生成二维数组模型的设计

通过二维数组模型解决获取树形平铺数据节点关系
使用数组转置的思路获取(row, col)

```js
[0,1,2,3,01,11,12,21,31,32,311]

->>

[
  [ 0, 1, 2, 3 ],
  [ 01, 11, 12, 21, 31, 32 ],
  [ 311 ]
]

->>

[
  [0, 01, *],
  [1, 11, *],
  [1, 12, *],
  [2, 21, *],
  [3, 31, 311],
  [3, 32, *]
]

->>

[
  [0, 01, *],
  [1, 11, *],
  [*, 12, *],
  [2, 21, *],
  [3, 31, 311],
  [*, 32, *]
]

->>

[
  [  0,  1,  *,  2,  3,  *],
  [ 01, 11, 12, 21, 31, 32],
  [  *,  *,  *,  *,311,  *]
] 

=> item = Object.assign(item, {
  treeDataValueRange: [startRowIndex, startColIndex, endRowIndex, endColIndex]
})
```

### 功能目录

```
src
├─libs
|  ├─array-utils.js
|  ├─desc-level-tree-data.js
|  ├─level-tree-data.js
|  ├─tree-data-value-range
|  | ├─index.js
|  | ├─helpers
|  | |    └index.js

tests
├─unit
|  ├─libs
|  |  level-tree-data.spec.js
```
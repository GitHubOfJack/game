# React + Vite + Three.js 开发规范

您是一位精通 React、Vite、Tailwind CSS、three.js、React Three Fiber 和 Next UI 的专家，专注于构建高性能、现代化的前端应用和3D交互体验。

## 核心原则

- **简洁精准的技术响应**：提供准确的 React 代码示例，避免冗余
- **函数式 & 声明式编程**：优先使用函数组件，避免类组件
- **模块化 & 可复用性**：通过迭代和模块化减少重复代码
- **描述性变量命名**：使用助动词（如 isLoading、hasError）
- **目录命名规范**：小写 + 短横线（如 components/auth-wizard）
- **命名导出（Named Exports）**：组件优先使用 export function Component()
- **RORO 模式**：接收对象，返回对象，函数参数和返回值使用对象结构，提升可读性和扩展性

## JavaScript/TypeScript 规范

### ✅ 函数声明
- 纯函数使用 function 关键字，省略分号

### ✅ TypeScript 优先
- 优先使用 interface 而非 type（除非需要联合类型或复杂类型）
- 避免 enum，改用 const MAP = { ... } as const

### ✅ 文件结构

```tsx
// 1. 导出的主组件
export function Component() { ... }

// 2. 子组件（如果较小，可内联）
function SubComponent() { ... }

// 3. Helper 函数
function formatDate() { ... }

// 4. 静态内容（如文案）
const LABELS = { ... }

// 5. 类型定义
interface Props { ... }
```

### ✅ 条件语句优化
- 单行条件省略 {}：`if (condition) doSomething()`
- 使用 && 代替简单条件渲染：`{isVisible && <Modal />}`

## 错误处理 & 验证

### 🚨 优先处理错误和边界情况

```tsx
function fetchData(params) {
  // 1. 错误处理前置（Guard Clauses）
  if (!params.id) return { error: "ID 必填" }
  
  // 2. 提前返回无效状态
  if (params.id === "invalid") return { error: "无效 ID" }
  
  // 3. 主逻辑放在最后（Happy Path）
  return { data: ... }
}
```

### ✅ React 错误管理
- 预期错误（如表单验证）：使用 useActionState + react-hook-form，返回错误对象
- 意外错误（如 API 失败）：通过 error.tsx 和 global-error.tsx 捕获，提供降级 UI
- TanStack Query：抛出用户友好的错误，由 useQuery / useMutation 显示

## React 最佳实践

### ⚛ 组件设计

```tsx
// ✅ 使用 function 声明组件
export function UserCard({ user }) {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

### 🎨 样式方案
- **Tailwind CSS**：原子化类名，避免手写 CSS
- **Next UI**：复用高质量组件（如 `<Button>`, `<Modal>`）
- **响应式设计**：Tailwind 断点（md:, lg:）

### 📦 性能优化
- **动态加载**：React.lazy + Suspense 非关键组件
- **图片优化**：WebP 格式 + loading="lazy"
- **3D 性能（React Three Fiber）**：
  - 使用 instancedMesh 批量渲染相同物体
  - 动态加载 GLTF 模型

## 代码组织 & 架构

### 📂 目录结构示例

```
src/
├── components/          # 可复用组件
│   ├── auth-wizard/     # 功能模块
│   │   ├── AuthForm.tsx
│   │   ├── useAuth.ts   # Hook
│   │   └── types.ts
├── lib/                # 工具函数
├── stores/             # 状态管理（Zustand/Jotai）
└── app/
    ├── (main)/         # Next.js 路由
    │   ├── page.tsx
    │   ├── loading.tsx # Suspense 回退
    │   └── error.tsx   # 错误边界
```

## 关键工具 & 推荐实践

### 🛠 技术栈组合
- **Vite**：超快构建 + HMR
- **React Three Fiber**：声明式 three.js 封装
- **Next UI**：美观 + 可定制的组件库
- **TanStack Query**：数据获取 + 错误处理

### 🔧 调试技巧
- **React DevTools**：检查组件树和状态
- **Three.js Inspector**：调试 3D 场景
- **Tailwind Debug**：@debug 指令检查样式冲突
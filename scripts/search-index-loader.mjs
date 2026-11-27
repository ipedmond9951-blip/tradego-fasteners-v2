// 构建站内搜索索引时，用自定义 ESM loader 把 `@/i18n` 别名指向一个桩模块。
// productI18n.ts 里 `import { type Locale } from '@/i18n'` 只是类型导入，
// 运行期不需要任何绑定；桩模块保证 node 直接读取 TS 数据源时能解析别名。
export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@/i18n') {
    return {
      url: 'data:text/javascript,export const Locale = "en";',
      shortCircuit: true,
    }
  }
  return nextResolve(specifier, context)
}

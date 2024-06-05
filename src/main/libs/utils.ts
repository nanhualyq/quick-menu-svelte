import { escape } from 'lodash'

export function wrapCode(content: string): string {
  return `<pre style="text-align: left;"><code>${escape(content)}</code></pre>`
}

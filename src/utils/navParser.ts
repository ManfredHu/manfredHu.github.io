import { load } from 'js-yaml'
import type { NavNode } from '@/types/nav'

export function parseNav(yamlContent: string): NavNode[] {
  const data = load(yamlContent)
  if (!Array.isArray(data)) {
    throw new Error('nav.yml must be a YAML array at the root level')
  }
  return data as NavNode[]
}

/**
 * Flatten all leaf nodes (nodes with a link) from the nav tree.
 */
export function flattenNavLinks(nodes: NavNode[]): NavNode[] {
  const result: NavNode[] = []
  function walk(list: NavNode[]) {
    for (const node of list) {
      if (node.link) result.push(node)
      if (node.children) walk(node.children)
    }
  }
  walk(nodes)
  return result
}

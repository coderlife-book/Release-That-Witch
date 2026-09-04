import { describe, expect, it } from 'vitest';
import { links, nodes, progress } from '../src/data';

describe('knowledge graph data', () => {
  it('uses unique node ids', () => {
    const ids = nodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only links existing nodes', () => {
    const ids = new Set(nodes.map((node) => node.id));
    for (const link of links) {
      expect(ids.has(link.source), `missing source: ${link.source}`).toBe(true);
      expect(ids.has(link.target), `missing target: ${link.target}`).toBe(true);
    }
  });

  it('contains the requested major systems', () => {
    const ids = new Set(nodes.map((node) => node.id));
    for (const id of [
      'roland',
      'witch-union',
      'city-hall',
      'third-border-district',
      'sleeping-island-witches',
      'four-kingdoms',
      'graycastle',
      'dawn',
      'wolfheart',
      'everwinter',
      'church',
      'judgment-army',
      'gods-punishment-army',
    ]) {
      expect(ids.has(id), `missing required node: ${id}`).toBe(true);
    }
  });

  it('pins the spoiler boundary to the current reading progress', () => {
    expect(progress.id).toBe('wendy-glider');
    expect(progress.label).toContain('滑翔之翼');
  });
});

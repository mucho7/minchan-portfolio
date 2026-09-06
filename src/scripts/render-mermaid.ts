export async function renderMermaidDiagrams() {
  const nodes = document.querySelectorAll('pre.mermaid');
  if (nodes.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  const styles = getComputedStyle(document.documentElement);
  const color = (token: string) => styles.getPropertyValue(token).trim();

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    flowchart: { curve: 'basis' },
    themeVariables: {
      background: color('--diagram-surface'),
      primaryColor: color('--diagram-primary'),
      primaryTextColor: color('--ink'),
      primaryBorderColor: color('--diagram-border'),
      lineColor: color('--diagram-line'),
      secondaryColor: color('--diagram-secondary'),
      tertiaryColor: color('--diagram-tertiary'),
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    }
  });

  await mermaid.run({ querySelector: 'pre.mermaid' });
}

export async function renderMermaidDiagrams() {
  const nodes = document.querySelectorAll('pre.mermaid');
  if (nodes.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    flowchart: { curve: 'basis' },
    themeVariables: {
      background: '#f4f1ea',
      primaryColor: '#dce6df',
      primaryTextColor: '#171714',
      primaryBorderColor: '#315c4c',
      lineColor: '#6c6a63',
      secondaryColor: '#e7e3da',
      tertiaryColor: '#f4f1ea',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif'
    }
  });

  await mermaid.run({ querySelector: 'pre.mermaid' });
}

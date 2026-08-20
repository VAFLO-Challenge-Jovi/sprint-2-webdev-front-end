export default function TipsCard() {
  return (
    <section className="card" style={{ padding: 20 }} aria-labelledby="tips-title">
      <h4 id="tips-title" style={{ marginBottom: 12, fontSize: '0.85rem' }}>
        Dicas de captura
      </h4>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <li>✓ Use imagens com boa iluminação</li>
        <li>✓ Prefira imagens nítidas e sem borrão</li>
        <li>✓ Enquadre apenas o texto que deseja</li>
        <li>✓ Textos impressos têm maior precisão</li>
        <li>✓ Formatos JPG e PNG são suportados</li>
      </ul>
    </section>
  );
}

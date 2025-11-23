import React, { useState } from 'react';

type Payload = {
  to?: string;
  cc?: string;
  from?: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: string;
};

type ResponseData = {
  status?: string;
  received?: Payload;
};

const App: React.FC = () => {
  const [to, setTo] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [attachments, setAttachments] = useState<string>('');

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPayload = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload: Payload = {
        to,
        cc,
        from,
        subject,
        text,
        html,
        attachments,
      };

      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      // Si el servidor no devuelve JSON, json será {}
      setResponse(json as ResponseData);

      if (!res.ok) {
        setError((json as any)?.error ?? 'Error en la respuesta');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Opcional: función para renderizar el resultado tal cual como llega
  const renderResponse = () => {
    if (!response) return null;
    return (
      <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 6 }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Prueba /api/parse (Express) con React TSX</h1>

      <div style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
        <input placeholder="To" value={to} onChange={e => setTo(e.target.value)} />
        <input placeholder="Cc" value={cc} onChange={e => setCc(e.target.value)} />
        <input placeholder="From" value={from} onChange={e => setFrom(e.target.value)} />
        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <textarea placeholder="Text" value={text} onChange={e => setText(e.target.value)} rows={4} />
        <textarea placeholder="HTML" value={html} onChange={e => setHtml(e.target.value)} rows={4} />
        <input placeholder="Attachments (texto)" value={attachments} onChange={e => setAttachments(e.target.value)} />

        <button onClick={sendPayload} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar payload JSON'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: 12 }}>
          Error: {error}
        </div>
      )}

      {renderResponse()}
    </div>
  );
};

export default App;
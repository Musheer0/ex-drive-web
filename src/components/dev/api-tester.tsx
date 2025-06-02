'use client';

import { useState, ChangeEvent } from 'react';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export default function ApiTester() {
  const [url, setUrl] = useState<string>('');
  const [method, setMethod] = useState<HTTPMethod>('GET');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'url') setUrl(value);
    if (name === 'body') setBody(value);
  };

  const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as HTTPMethod);
  };

  const sendRequest = async (): Promise<void> => {
    try {
      setError('');
      setResponse('');
      setStatus(null);

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      };

      if (method !== 'GET' && body) {
        options.body = body;
      }

      const res: Response = await fetch(`${process.env.NEXT_PUBLIC_API}${url}`, options);
      setStatus(res.status);

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text); // fallback if not valid JSON
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">API Tester (Type-Safe)</h1>

      <input
        name="url"
        className="w-full border p-2 rounded"
        placeholder="Enter URL"
        value={url}
        onChange={handleInputChange}
      />

      <select
        className="w-full border p-2 rounded"
        value={method}
        onChange={handleMethodChange}
      >
        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <textarea
        name="body"
        className="w-full border p-2 rounded font-mono"
        placeholder='Raw JSON body (e.g. {"name":"Musheer"})'
        rows={6}
        value={body}
        onChange={handleInputChange}
        disabled={method === 'GET'}
      />

      <button
        className="bg-black text-white p-2 rounded hover:opacity-80"
        onClick={sendRequest}
      >
        Send Request
      </button>

      {status !== null && (
        <div className="font-bold">Status: {status}</div>
      )}

      {error && (
        <div className="text-red-500 font-mono">Error: {error}</div>
      )}

      {response && (
        <pre className=" p-2 rounded text-sm overflow-x-auto">
          {response}
        </pre>
      )}
    </div>
  );
}

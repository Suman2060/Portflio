import { useEffect, useState } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '../../api/messages';
import type { Message } from '../../types/message';

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function load() {
    try {
      setMessages(await getMessages());
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMessages();
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="file-label">
          {messages.length} messages · {unread} unread
        </span>
      </div>
      {messages.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--mid)' }}>inbox is empty.</p>
      )}
      {messages.map((m) => (
        <div
          key={m.id}
          className="panel-soft px-5 py-4"
          style={m.isRead ? undefined : { borderColor: 'var(--brand)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display uppercase font-bold tracking-tight" style={{ fontSize: 17 }}>
                  {m.name}
                </span>
                <a className="file-label hover:opacity-70" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
                {!m.isRead && (
                  <span className="tag-pill" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>
                    new
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--ink)' }}>{m.message}</p>
              <div className="file-label mt-2">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!m.isRead && (
                <button
                  className="file-chip"
                  onClick={async () => {
                    await markMessageRead(m.id);
                    await load();
                  }}
                >
                  mark read
                </button>
              )}
              <button
                className="file-chip"
                style={{ color: 'var(--brand)' }}
                onClick={async () => {
                  await deleteMessage(m.id);
                  await load();
                }}
              >
                delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
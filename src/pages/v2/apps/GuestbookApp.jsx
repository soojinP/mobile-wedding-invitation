import { useState, useEffect } from 'react'
import './GuestbookApp.css'

const STORAGE_KEY = 'wedding-guestbook'

function loadEntries() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export default function GuestbookApp() {
  const [entries, setEntries] = useState(loadEntries)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const handleSubmit = () => {
    const trimName = name.trim()
    const trimMsg = message.trim()
    if (!trimName || !trimMsg) return

    const entry = {
      id: Date.now(),
      name: trimName,
      message: trimMsg,
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
    setEntries([entry, ...entries])
    setName('')
    setMessage('')
  }

  const canSubmit = name.trim() && message.trim()

  return (
    <div>
      <div className="guestbook-compose">
        <input
          className="guestbook-input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        <textarea
          className="guestbook-textarea"
          placeholder="축하 메시지를 남겨주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
        />
        <div className="guestbook-actions">
          <button
            className="guestbook-submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            작성
          </button>
        </div>
      </div>

      <div className="guestbook-list">
        {entries.length === 0 ? (
          <div className="guestbook-empty">
            아직 방명록이 없습니다.<br />첫 번째 축하 메시지를 남겨보세요!
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="guestbook-entry">
              <div className="guestbook-entry-header">
                <span className="guestbook-entry-name">{entry.name}</span>
                <span className="guestbook-entry-date">{entry.date}</span>
              </div>
              <p className="guestbook-entry-msg">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

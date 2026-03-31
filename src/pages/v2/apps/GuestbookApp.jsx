import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import './GuestbookApp.css'

export default function GuestbookApp() {
  const [entries, setEntries] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    fetchEntries()
  }, [])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    const trimName = name.trim()
    const trimMsg = message.trim()
    if (!trimName || !trimMsg) return

    setSubmitting(true)
    const { data } = await supabase
      .from('guestbook')
      .insert({ name: trimName, message: trimMsg })
      .select()
      .single()

    if (data) {
      setEntries([data, ...entries])
    }
    setName('')
    setMessage('')
    setSubmitting(false)
    setCooldown(30)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const canSubmit = name.trim() && message.trim() && !submitting && cooldown <= 0

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
            {submitting ? '작성 중...' : cooldown > 0 ? `${cooldown}초` : '작성'}
          </button>
        </div>
      </div>

      <div className="guestbook-list">
        {loading ? (
          <div className="guestbook-empty">불러오는 중...</div>
        ) : entries.length === 0 ? (
          <div className="guestbook-empty">
            아직 방명록이 없습니다.<br />첫 번째 축하 메시지를 남겨보세요!
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="guestbook-entry">
              <div className="guestbook-entry-header">
                <span className="guestbook-entry-name">{entry.name}</span>
                <span className="guestbook-entry-date">{formatDate(entry.created_at)}</span>
              </div>
              <p className="guestbook-entry-msg">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

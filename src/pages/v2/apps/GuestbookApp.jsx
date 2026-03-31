import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import './GuestbookApp.css'

export default function GuestbookApp() {
  const [entries, setEntries] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editMsg, setEditMsg] = useState('')
  const [editPw, setEditPw] = useState('')
  const [editError, setEditError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deletePw, setDeletePw] = useState('')
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => { fetchEntries() }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {
    const trimName = name.trim()
    const trimMsg = message.trim()
    const trimPw = password.trim()
    if (!trimName || !trimMsg || !trimPw) return

    setSubmitting(true)
    const { data } = await supabase
      .from('guestbook')
      .insert({ name: trimName, message: trimMsg, password: trimPw })
      .select('id, name, message, created_at')
      .single()

    if (data) {
      setEntries([data, ...entries])
    }
    setName('')
    setMessage('')
    setPassword('')
    setSubmitting(false)
    setCooldown(30)
  }

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setEditMsg(entry.message)
    setEditPw('')
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditMsg('')
    setEditPw('')
    setEditError('')
  }

  const submitEdit = async (id) => {
    if (!editMsg.trim() || !editPw.trim()) return
    const { error } = await supabase
      .from('guestbook')
      .update({ message: editMsg.trim() })
      .eq('id', id)
      .eq('password', editPw.trim())

    if (error) {
      setEditError('비밀번호가 틀립니다')
      return
    }
    // Check if row was actually updated
    const { data: check } = await supabase
      .from('guestbook')
      .select('message')
      .eq('id', id)
      .single()

    if (check && check.message === editMsg.trim()) {
      setEntries(entries.map(e => e.id === id ? { ...e, message: editMsg.trim() } : e))
      cancelEdit()
    } else {
      setEditError('비밀번호가 틀립니다')
    }
  }

  const startDelete = (id) => {
    setDeleteConfirm(id)
    setDeletePw('')
    setDeleteError('')
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
    setDeletePw('')
    setDeleteError('')
  }

  const submitDelete = async (id) => {
    if (!deletePw.trim()) return
    const { data } = await supabase
      .from('guestbook')
      .delete()
      .eq('id', id)
      .eq('password', deletePw.trim())
      .select()

    if (data && data.length > 0) {
      setEntries(entries.filter(e => e.id !== id))
      cancelDelete()
    } else {
      setDeleteError('비밀번호가 틀립니다')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const canSubmit = name.trim() && message.trim() && password.trim() && !submitting && cooldown <= 0

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
        <input
          className="guestbook-input"
          placeholder="비밀번호 (수정/삭제용)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

              {editingId === entry.id ? (
                <div className="guestbook-edit-form">
                  <textarea
                    className="guestbook-textarea"
                    value={editMsg}
                    onChange={(e) => setEditMsg(e.target.value)}
                    maxLength={200}
                  />
                  <input
                    className="guestbook-input"
                    type="password"
                    placeholder="비밀번호"
                    value={editPw}
                    onChange={(e) => { setEditPw(e.target.value); setEditError('') }}
                  />
                  {editError && <p className="guestbook-error">{editError}</p>}
                  <div className="guestbook-edit-actions">
                    <button className="guestbook-btn-sm" onClick={cancelEdit}>취소</button>
                    <button className="guestbook-btn-sm primary" onClick={() => submitEdit(entry.id)}>수정</button>
                  </div>
                </div>
              ) : deleteConfirm === entry.id ? (
                <div className="guestbook-edit-form">
                  <p className="guestbook-delete-msg">정말 삭제하시겠습니까?</p>
                  <input
                    className="guestbook-input"
                    type="password"
                    placeholder="비밀번호"
                    value={deletePw}
                    onChange={(e) => { setDeletePw(e.target.value); setDeleteError('') }}
                  />
                  {deleteError && <p className="guestbook-error">{deleteError}</p>}
                  <div className="guestbook-edit-actions">
                    <button className="guestbook-btn-sm" onClick={cancelDelete}>취소</button>
                    <button className="guestbook-btn-sm danger" onClick={() => submitDelete(entry.id)}>삭제</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="guestbook-entry-msg">{entry.message}</p>
                  <div className="guestbook-entry-btns">
                    <button className="guestbook-action-btn" onClick={() => startEdit(entry)}>수정</button>
                    <button className="guestbook-action-btn" onClick={() => startDelete(entry.id)}>삭제</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

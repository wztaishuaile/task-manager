import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase.js'

const PRIORITIES = ['高', '中', '低']
const FILTERS = ['全部', '高', '中', '低']

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('中')
  const [filter, setFilter] = useState('全部')
  const [submitting, setSubmitting] = useState(false)

  // 加载任务列表，按创建时间倒序（最新在最上面）
  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('加载任务失败：' + error.message)
      setTasks([])
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks = useMemo(() => {
    if (filter === '全部') return tasks
    return tasks.filter((t) => t.priority === filter)
  }, [tasks, filter])

  const handleAdd = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('请输入任务标题')
      return
    }
    setSubmitting(true)
    setError('')
    const { error } = await supabase
      .from('tasks')
      .insert({ title: trimmed, priority })
    if (error) {
      setError('添加任务失败：' + error.message)
    } else {
      setTitle('')
      setPriority('中')
      fetchTasks()
    }
    setSubmitting(false)
  }

  const handleToggle = async (task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id)
    if (error) {
      setError('更新状态失败：' + error.message)
      return
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t,
      ),
    )
  }

  const handleDelete = async (task) => {
    const { error } = await supabase.from('tasks').delete().eq('id', task.id)
    if (error) {
      setError('删除任务失败：' + error.message)
      return
    }
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">智能任务管理系统</h1>

        <form className="add-form" onSubmit={handleAdd}>
          <input
            className="title-input"
            type="text"
            placeholder="输入任务标题…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          <select
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}优先级
              </option>
            ))}
          </select>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? '添加中…' : '添加'}
          </button>
        </form>

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={'filter-btn' + (filter === f ? ' active' : '')}
              type="button"
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="empty">加载中…</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty">暂无任务，添加一条吧～</div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={'task-item' + (task.completed ? ' done' : '')}
              >
                <div className="task-main">
                  <span className="task-title">{task.title}</span>
                  <span className={'tag tag-' + task.priority}>
                    {task.priority}
                  </span>
                  <span className="task-status">
                    {task.completed ? '已完成' : '未完成'}
                  </span>
                </div>
                <div className="task-actions">
                  <button
                    className="btn-toggle"
                    type="button"
                    onClick={() => handleToggle(task)}
                  >
                    {task.completed ? '标记未完成' : '标记完成'}
                  </button>
                  <button
                    className="btn-delete"
                    type="button"
                    onClick={() => handleDelete(task)}
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

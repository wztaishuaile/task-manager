import { createClient } from '@supabase/supabase-js'

// 优先读取 Vite 前缀变量；同时兼容手册中 SUPABASE_URL / SUPABASE_ANON_KEY 的命名
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少 Supabase 环境变量：请参照 .env.example 配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

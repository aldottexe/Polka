import { createSupabaseClient } from '$lib/db/supabase'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')
  const supabase = createSupabaseClient(fetch, {getAll: () => data.cookies})
  await supabase.realtime.setAuth()
  return { supabase, session: data.session }
}
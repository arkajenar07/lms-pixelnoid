const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('user_lesson_progress').select('*').limit(1);
  console.log('user_lesson_progress error:', error);
  
  const { data: cols, error: colsErr } = await supabase.rpc('get_schema_info_dummy');
  if (colsErr) {
     const { data: pg, error: pgErr } = await supabase.from('user_lesson_progress').select('id, user_id, lesson_id, status, completed_at').limit(1);
     console.log('Columns test:', pgErr ? pgErr.message : 'Columns exist');
  }
}

check();

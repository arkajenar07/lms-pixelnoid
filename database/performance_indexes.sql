-- ==============================================================================
-- INDEX PERFORMANCE OPTIMIZATION UNTUK LMS PIXELNOID
-- Eksekusi file query ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- ── 1. MODUL & KELAS (Class & Module Flow) ──────────────────────────────────
-- Pengecekan member kelas & query list kelas siswa (Seq Scan -> Index Scan)
CREATE INDEX IF NOT EXISTS idx_class_member_user_class 
ON class_member(user_id, class_id);

CREATE INDEX IF NOT EXISTS idx_class_member_user_id 
ON class_member(user_id);

-- Pengambilan modul per kelas yang terpublikasi & terurut
CREATE INDEX IF NOT EXISTS idx_class_modules_class_published_order 
ON class_modules(class_id, is_published, sort_order);

CREATE INDEX IF NOT EXISTS idx_class_modules_slug_published 
ON class_modules(slug) WHERE is_published = true;

-- Relasi dan sorting instan untuk pelajaran (module_lessons)
CREATE INDEX IF NOT EXISTS idx_module_lessons_module_sort 
ON module_lessons(module_id, sort_order);

-- Riwayat progres pelajaran siswa (user_lesson_progress)
-- Query status 'completed' yang sering dipanggil menjadi < 2ms (Index Scan)
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_lesson 
ON user_lesson_progress(user_id, lesson_id);

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_completed 
ON user_lesson_progress(user_id, status, lesson_id);


-- ── 2. AKTIVITAS: TUGAS & FEEDBACK (Student Assignments & Reviews) ──────────
-- Filter tugas per siswa dan urutkan berdasarkan waktu buat
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_created 
ON student_assignments(student_id, created_at DESC);

-- Filter tugas berdasarkan status (pending, submitted, reviewed)
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_status 
ON student_assignments(student_id, status);

-- Index khusus untuk catatan / review mentor yang sudah dinilai
CREATE INDEX IF NOT EXISTS idx_student_assignments_feedback_filtered 
ON student_assignments(student_id, feedback_at DESC) 
WHERE feedback IS NOT NULL;

-- Relasi foreign key ke tabel assignments & mentor
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment_id 
ON student_assignments(assignment_id);

CREATE INDEX IF NOT EXISTS idx_student_assignments_feedback_by 
ON student_assignments(feedback_by);

-- Index GIN untuk pencarian role mentor di tabel users
CREATE INDEX IF NOT EXISTS idx_users_roles_gin 
ON users USING GIN(roles);


-- ── 3. ANALISIS ULANG STATISTIK QUERY PLANNER ──────────────────────────────
ANALYZE class_member;
ANALYZE class_modules;
ANALYZE module_lessons;
ANALYZE user_lesson_progress;
ANALYZE student_assignments;
ANALYZE users;

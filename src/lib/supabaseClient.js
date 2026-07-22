import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqjspiefffnmwqmazkim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxanNwaWVmZmZubXdxbWF6a2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MzM0NzEsImV4cCI6MjEwMDMwOTQ3MX0.hP5UIIQZlQ4xbFGTHdMiOCtI_KYlun2GJv0F1MtCFUc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

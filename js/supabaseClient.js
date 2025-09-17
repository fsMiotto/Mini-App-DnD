// Importa a função createClient da biblioteca do Supabase via CDN.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// =================================================================================
//  COLOQUE AS SUAS CREDENCIAIS DO SUPABASE AQUI!
//  Este é o único local onde as suas chaves devem estar.
// =================================================================================
const SUPABASE_URL = 'https://dvwpzqkoanwqysfdlymr.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d3B6cWtvYW53cXlzZmRseW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTkzOTksImV4cCI6MjA2OTgzNTM5OX0.-doywHumdnLGeHjqOPoevpwE-Lca3rJMSsptJwiJtcA'; 

// Cria o "cliente" Supabase.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
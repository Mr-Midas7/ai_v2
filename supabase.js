/**
 * Supabase Configuration & Helper Functions
 * Fake Rider Motorparts
 */

// Initialize Supabase Client
// Note: Replace these with your actual Supabase URL and Anon Key from the Dashboard
const SUPABASE_URL = 'https://xfygrjbxytamyrzwfkwt.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_FFp7MGSwvEGSGeCFmIv7-w_nKd4sLX4';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Helpers
async function signUp(email, password, fullName) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });
    return { data, error };
}

async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = 'index.html';
    }
    return error;
}

async function getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return null;
    
    // Fetch profile for role
    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
    return profile ? { ...user, ...profile } : user;
}

// Database Helpers - Appointments
async function createAppointment(appointmentData) {
    const { data, error } = await supabaseClient
        .from('appointments')
        .insert([appointmentData])
        .select();
    return { data, error };
}

async function getAppointments(role, userId = null) {
    let query = supabaseClient.from('appointments').select(`
        *,
        services (name, duration_minutes, price),
        profiles (full_name, email)
    `);

    if (role === 'customer' && userId) {
        query = query.eq('user_id', userId);
    }
    
    // Sort by date and time
    query = query.order('appointment_date', { ascending: true })
                 .order('appointment_time', { ascending: true });

    const { data, error } = await query;
    return { data, error };
}

async function updateAppointmentStatus(id, status, staffNotes = '') {
    const { data, error } = await supabaseClient
        .from('appointments')
        .update({ status, staff_notes: staffNotes })
        .eq('id', id)
        .select();
    return { data, error };
}

// Database Helpers - Services
async function getServices() {
    const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .order('name');
    return { data, error };
}

async function checkAvailability(date, time) {
    const { data, error } = await supabaseClient
        .from('appointments')
        .select('id')
        .eq('appointment_date', date)
        .eq('appointment_time', time)
        .not('status', 'eq', 'cancelled');
        
    return { isAvailable: data && data.length === 0, error };
}

// Export functions to window for global access (vanilla JS style)
window.fakeRiderAuth = { signUp, signIn, signOut, getCurrentUser };
window.fakeRiderDB = { 
    createAppointment, 
    getAppointments, 
    updateAppointmentStatus, 
    getServices, 
    checkAvailability 
};
window.supabase = supabaseClient;

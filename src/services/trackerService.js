import { supabase } from '../lib/supabaseClient';

/**
 * Detects device type from user agent
 */
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

/**
 * Detects browser name from user agent
 */
function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}

/**
 * Captures visitor info and saves it to Supabase
 */
export async function captureAndSaveVisit() {
  try {
    // Fetch IP and geolocation data
    const res = await fetch('https://ipapi.co/json/');
    const geo = await res.json();

    const visitData = {
      ip: geo.ip || 'N/A',
      city: geo.city || 'N/A',
      region: geo.region || 'N/A',
      country: geo.country_name || 'N/A',
      isp: geo.org || 'N/A',
      device: getDeviceType(),
      browser: getBrowserName(),
      user_agent: navigator.userAgent,
      referrer: document.referrer || 'Direto',
    };

    const { error } = await supabase.from('vsco_clicks').insert([visitData]);

    if (error) {
      console.error('Erro ao salvar visita:', error.message);
    }
  } catch (err) {
    console.error('Erro no tracker:', err);
  }
}

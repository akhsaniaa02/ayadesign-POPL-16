/**
 * Web Vitals Performance Monitoring
 * Tracks and logs Core Web Vitals: LCP, FID, CLS, INP, TTFB, FCP
 */
import { onCLS, onFID, onLCP, onINP, onTTFB, onFCP } from 'web-vitals';
import { logPerformance } from './clientLogger';

/**
 * Rate metric based on Web Vitals thresholds
 */
function rateMetric(name, value) {
    const thresholds = {
        CLS: { good: 0.1, poor: 0.25 },
        FID: { good: 100, poor: 300 },
        LCP: { good: 2500, poor: 4000 },
        INP: { good: 200, poor: 500 },
        TTFB: { good: 800, poor: 1800 },
        FCP: { good: 1800, poor: 3000 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
}

/**
 * Handle metric and send to Loki
 */
function handleMetric(metric) {
    const rating = rateMetric(metric.name, metric.value);
    
    // Add rating to metric
    const enrichedMetric = {
        ...metric,
        rating
    };

    // Log to Grafana Loki
    logPerformance(enrichedMetric);

    // Console log in development
    if (import.meta.env.DEV) {
        console.log(`[Web Vitals] ${metric.name}:`, {
            value: metric.value,
            rating,
            id: metric.id
        });
    }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
    // Cumulative Layout Shift
    onCLS(handleMetric);
    
    // First Input Delay (deprecated but still useful)
    onFID(handleMetric);
    
    // Largest Contentful Paint
    onLCP(handleMetric);
    
    // Interaction to Next Paint (replaces FID)
    onINP(handleMetric);
    
    // Time to First Byte
    onTTFB(handleMetric);
    
    // First Contentful Paint
    onFCP(handleMetric);
}

export default initWebVitals;

/**
 * Grafana Loki Client Logger Utility
 * Sends structured JSON logs from browser to backend proxy
 * Uses navigator.sendBeacon() for non-blocking logging
 */

const LOG_ENDPOINT = import.meta.env.VITE_BASE_URL 
    ? `${import.meta.env.VITE_BASE_URL}/api/logs`
    : 'http://localhost:3001/api/logs';

/**
 * Get client metadata
 */
function getClientMetadata() {
    return {
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        platform: navigator.platform,
        online: navigator.onLine,
        connection_type: navigator.connection?.effectiveType || 'unknown',
        memory: navigator.deviceMemory || 'unknown',
        cores: navigator.hardwareConcurrency || 'unknown',
    };
}

/**
 * Send log to backend using sendBeacon (non-blocking)
 * Falls back to fetch if sendBeacon is not available
 */
function sendLog(logData) {
    const payload = {
        timestamp: new Date().toISOString(),
        route: window.location.pathname,
        referrer: document.referrer,
        ...logData,
        client: getClientMetadata()
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    // Try sendBeacon first (non-blocking, works even when page is unloading)
    if (navigator.sendBeacon) {
        const success = navigator.sendBeacon(LOG_ENDPOINT, blob);
        if (success) return;
    }

    // Fallback to fetch if sendBeacon fails or not available
    fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true // Keep request alive even if page unloads
    }).catch(err => {
        console.error('Failed to send log:', err);
    });
}

/**
 * Log user interaction (button click, form submit, etc.)
 */
export function logInteraction(action, target, metadata = {}) {
    sendLog({
        level: 'info',
        type: 'user_interaction',
        action,
        target,
        ...metadata
    });
}

/**
 * Log navigation event
 */
export function logNavigation(from, to, method = 'click') {
    sendLog({
        level: 'info',
        type: 'navigation',
        from,
        to,
        method
    });
}

/**
 * Log client-side error
 */
export function logError(error, context = {}) {
    sendLog({
        level: 'error',
        type: 'client_error',
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        ...context
    });
}

/**
 * Log performance metric (Web Vitals)
 */
export function logPerformance(metric) {
    sendLog({
        level: 'info',
        type: 'performance',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        metric_id: metric.id,
        navigation_type: metric.navigationType
    });
}

/**
 * Log API call from frontend
 */
export function logApiCall(url, method, status, duration) {
    sendLog({
        level: 'info',
        type: 'api_call',
        url,
        method,
        status,
        duration_ms: duration
    });
}

/**
 * Log custom event
 */
export function logEvent(eventName, data = {}) {
    sendLog({
        level: 'info',
        type: 'custom_event',
        event: eventName,
        ...data
    });
}

// Install global error handler
window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Install unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        promise: event.promise
    });
});

export default {
    logInteraction,
    logNavigation,
    logError,
    logPerformance,
    logApiCall,
    logEvent
};

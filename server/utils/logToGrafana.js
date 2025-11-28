/**
 * Grafana Loki Logger Utility for Backend
 * Sends structured JSON logs to Grafana Loki instance
 */

const LOKI_ENDPOINT = process.env.LOKI_ENDPOINT || 'http://localhost:3100/loki/api/v1/push';
const APP_NAME = 'ayadesign-api';

// Track cold start for serverless functions
let isColdStart = true;

/**
 * Format logs in Loki-compatible JSON structure
 * @param {Object} logData - Log data to send
 * @returns {Object} Formatted Loki payload
 */
function formatLokiPayload(logData) {
    const timestamp = Date.now() * 1000000; // Nanoseconds
    
    const labels = {
        app: APP_NAME,
        level: logData.level || 'info',
        environment: process.env.NODE_ENV || 'development',
        service: 'backend',
        ...logData.labels
    };

    const values = {
        timestamp: new Date().toISOString(),
        ...logData,
        cold_start: isColdStart,
        region: process.env.VERCEL_REGION || 'local',
    };

    return {
        streams: [
            {
                stream: labels,
                values: [
                    [timestamp.toString(), JSON.stringify(values)]
                ]
            }
        ]
    };
}

/**
 * Send logs to Grafana Loki
 * @param {Object} logData - Log data
 */
async function sendToLoki(logData) {
    try {
        const payload = formatLokiPayload(logData);
        
        const response = await fetch(LOKI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Failed to send logs to Loki:', response.statusText);
        }

        // Mark cold start as false after first successful log
        if (isColdStart) {
            isColdStart = false;
        }
    } catch (error) {
        // Fail silently to avoid breaking app if Loki is down
        console.error('Error sending to Loki:', error.message);
    }
}

/**
 * Log API request
 */
function logApiRequest(data) {
    return sendToLoki({
        level: 'info',
        type: 'api_request',
        route: data.route,
        method: data.method,
        status: data.status,
        latency_ms: data.latency,
        user_agent: data.userAgent,
        ip: data.ip,
        labels: {
            method: data.method,
            route: data.route,
            status: data.status?.toString()
        }
    });
}

/**
 * Log application error
 */
function logError(error, context = {}) {
    return sendToLoki({
        level: 'error',
        type: 'application_error',
        error_message: error.message,
        error_stack: error.stack,
        ...context,
        labels: {
            error_type: error.name || 'Error'
        }
    });
}

/**
 * Log custom event
 */
function logEvent(eventName, data = {}) {
    return sendToLoki({
        level: 'info',
        type: 'custom_event',
        event: eventName,
        ...data
    });
}

/**
 * Log database operation
 */
function logDatabaseQuery(operation, collection, duration) {
    return sendToLoki({
        level: 'debug',
        type: 'database_query',
        operation,
        collection,
        duration_ms: duration,
        labels: {
            db_operation: operation,
            collection
        }
    });
}

module.exports = {
    logApiRequest,
    logError,
    logEvent,
    logDatabaseQuery,
    sendToLoki
};

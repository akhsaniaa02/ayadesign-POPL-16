/**
 * Express Middleware for Logging API Requests to Grafana Loki
 */
const { logApiRequest } = require('../utils/logToGrafana');

function apiLoggingMiddleware(req, res, next) {
    const startTime = Date.now();

    // Capture original res.send
    const originalSend = res.send;
    const originalJson = res.json;

    // Override res.send to capture response
    res.send = function (data) {
        res.send = originalSend;
        const latency = Date.now() - startTime;

        // Log to Grafana Loki
        logApiRequest({
            route: req.path,
            method: req.method,
            status: res.statusCode,
            latency,
            userAgent: req.get('user-agent'),
            ip: req.ip || req.connection.remoteAddress,
        });

        return originalSend.call(this, data);
    };

    // Override res.json to capture response
    res.json = function (data) {
        res.json = originalJson;
        const latency = Date.now() - startTime;

        // Log to Grafana Loki
        logApiRequest({
            route: req.path,
            method: req.method,
            status: res.statusCode,
            latency,
            userAgent: req.get('user-agent'),
            ip: req.ip || req.connection.remoteAddress,
        });

        return originalJson.call(this, data);
    };

    next();
}

module.exports = apiLoggingMiddleware;

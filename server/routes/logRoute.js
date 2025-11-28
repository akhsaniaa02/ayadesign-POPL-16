const express = require('express');
const router = express.Router();
const { sendToLoki } = require('../utils/logToGrafana');

/**
 * POST /api/logs
 * Proxy endpoint to receive frontend logs and forward to Grafana Loki
 * This avoids CORS issues when frontend directly sends to Loki
 */
router.post('/logs', async (req, res) => {
    try {
        const clientLog = req.body;

        // Add server-side metadata
        const enrichedLog = {
            ...clientLog,
            level: clientLog.level || 'info',
            service: 'frontend',
            server_timestamp: new Date().toISOString(),
            forwarded_from: 'backend_proxy',
            labels: {
                service: 'frontend',
                type: clientLog.type || 'client_log',
                level: clientLog.level || 'info'
            }
        };

        // Forward to Loki
        await sendToLoki(enrichedLog);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error forwarding log to Loki:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

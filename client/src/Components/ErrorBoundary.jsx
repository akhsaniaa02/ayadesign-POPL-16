/**
 * React Error Boundary with Grafana Loki Logging
 * Catches React component errors and logs them to Loki
 */
import React from 'react';
import { logError } from '../utils/clientLogger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to Grafana Loki
        logError(error, {
            component_stack: errorInfo.componentStack,
            error_boundary: true,
            ...this.props.context // Allow passing additional context
        });

        // Update state
        this.setState({
            error,
            errorInfo
        });

        // Call optional error callback
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                    reset: this.handleReset
                });
            }

            // Default fallback UI
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '8px',
                    margin: '20px'
                }}>
                    <h2 style={{ color: '#856404' }}>⚠️ Something went wrong</h2>
                    <p style={{ color: '#856404' }}>
                        We've been notified and are working on it.
                    </p>
                    {import.meta.env.DEV && (
                        <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '20px' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                Error Details (Development Only)
                            </summary>
                            <pre style={{ 
                                backgroundColor: '#f8f9fa', 
                                padding: '15px', 
                                borderRadius: '4px',
                                overflow: 'auto'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                {'\n\n'}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={this.handleReset}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#ffc107',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

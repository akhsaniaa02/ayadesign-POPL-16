/**
 * React Hook for Logging User Interactions
 * Provides easy-to-use hooks for tracking clicks, navigation, form submissions
 */
import { useEffect, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { logInteraction, logNavigation } from '../utils/clientLogger';

/**
 * Hook to log button/element clicks
 * Usage: const logClick = useLogClick();
 *        <button onClick={() => logClick('submit_order', { productId: 123 })}>
 */
export function useLogClick() {
    return useCallback((action, metadata = {}) => {
        logInteraction('click', action, metadata);
    }, []);
}

/**
 * Hook to automatically log page navigation
 * Usage: useLogNavigation();
 */
export function useLogNavigation() {
    const location = useLocation();
    const navigationType = useNavigationType();
    
    useEffect(() => {
        logNavigation(
            document.referrer || 'direct',
            location.pathname,
            navigationType
        );
    }, [location, navigationType]);
}

/**
 * Hook to log form submissions
 * Usage: const logForm = useLogFormSubmit();
 *        <form onSubmit={logForm('login_form')}>
 */
export function useLogFormSubmit() {
    return useCallback((formName, metadata = {}) => {
        return (event) => {
            logInteraction('form_submit', formName, {
                ...metadata,
                action: event.target.action,
                method: event.target.method
            });
        };
    }, []);
}

/**
 * Hook to track time spent on page
 * Usage: usePageDuration();
 */
export function usePageDuration() {
    const location = useLocation();

    useEffect(() => {
        const startTime = Date.now();
        
        return () => {
            const duration = Date.now() - startTime;
            logInteraction('page_duration', location.pathname, {
                duration_ms: duration,
                duration_seconds: Math.round(duration / 1000)
            });
        };
    }, [location]);
}

/**
 * Hook to log API calls (wrapper for fetch/axios)
 * Usage: const loggedFetch = useLoggedFetch();
 *        loggedFetch('/api/login', { method: 'POST', ... })
 */
export function useLoggedFetch() {
    return useCallback(async (url, options = {}) => {
        const startTime = Date.now();
        
        try {
            const response = await fetch(url, options);
            const duration = Date.now() - startTime;
            
            logInteraction('api_call', url, {
                method: options.method || 'GET',
                status: response.status,
                duration_ms: duration,
                success: response.ok
            });
            
            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            logInteraction('api_call_failed', url, {
                method: options.method || 'GET',
                duration_ms: duration,
                error: error.message
            });
            
            throw error;
        }
    }, []);
}

export default {
    useLogClick,
    useLogNavigation,
    useLogFormSubmit,
    usePageDuration,
    useLoggedFetch
};

class Logger {
    static log(component, message, data = null) {
        const timestamp = new Date().toISOString();
        const dataStr = data ? JSON.stringify(data, null, 2) : '';
        
        console.log(
            `[${timestamp}] ${component}: ${message}`,
            dataStr ? '\n' + dataStr : ''
        );
    }

    static error(component, message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(
            `[${timestamp}] ${component}: ${message}`,
            error || ''
        );
    }
}

// Currency conversion rates (simulated data)
const exchangeRates = {
    USD: {
        EUR: 0.86384,
        GBP: 0.74666,
        JPY: 148.75,
        CAD: 1.3763,
        AUD: 1.4244,
        CHF: 0.9331,
        CNY: 7.2456
    },
    EUR: {
        USD: 1.1576,
        GBP: 0.8644,
        JPY: 172.23,
        CAD: 1.5932,
        AUD: 1.6489,
        CHF: 1.0801,
        CNY: 8.3856
    },
    GBP: {
        USD: 1.3394,
        EUR: 1.1569,
        JPY: 199.23,
        CAD: 1.8432,
        AUD: 1.9076,
        CHF: 1.2498,
        CNY: 9.7023
    },
    JPY: {
        USD: 0.00672,
        EUR: 0.00581,
        GBP: 0.00502,
        CAD: 0.00925,
        AUD: 0.00958,
        CHF: 0.00627,
        CNY: 0.04871
    },
    CAD: {
        USD: 0.7266,
        EUR: 0.6277,
        GBP: 0.5426,
        JPY: 108.08,
        AUD: 1.0349,
        CHF: 0.6781,
        CNY: 5.2634
    },
    AUD: {
        USD: 0.7021,
        EUR: 0.6065,
        GBP: 0.5242,
        JPY: 104.45,
        CAD: 0.9663,
        CHF: 0.6553,
        CNY: 5.0864
    },
    CHF: {
        USD: 1.0717,
        EUR: 0.9259,
        GBP: 0.8001,
        JPY: 159.44,
        CAD: 1.4744,
        AUD: 1.5264,
        CNY: 7.7647
    },
    CNY: {
        USD: 0.1381,
        EUR: 0.1193,
        GBP: 0.1031,
        JPY: 20.54,
        CAD: 0.1900,
        AUD: 0.1966,
        CHF: 0.1288
    }
};

// Currency change data (simulated)
const currencyChanges = {
    EUR: { change: 0.23, trend: 'positive' },
    GBP: { change: 0.044, trend: 'positive' },
    JPY: { change: 0.014, trend: 'positive' },
    CAD: { change: 0.27, trend: 'positive' },
    AUD: { change: -0.15, trend: 'negative' },
    CHF: { change: 0.08, trend: 'positive' },
    CNY: { change: -0.32, trend: 'negative' }
};

// DOM elements
let amountInput, fromCurrencySelect, toCurrencySelect, swapBtn, converterForm, converterResult, currencyRows;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    updateLiveRates();
    
    // Update rates every 30 seconds (simulated)
    setInterval(updateLiveRates, 30000);
});

// Initialize DOM elements
function initializeElements() {
    amountInput = document.getElementById('amount');
    fromCurrencySelect = document.getElementById('fromCurrency');
    toCurrencySelect = document.getElementById('toCurrency');
    swapBtn = document.getElementById('swapBtn');
    converterForm = document.getElementById('converterForm');
    converterResult = document.getElementById('converterResult');
    currencyRows = document.querySelectorAll('.currency-row');
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    converterForm.addEventListener('submit', handleConversion);
    
    // Swap currencies
    swapBtn.addEventListener('click', swapCurrencies);
    
    // Real-time conversion on input change
    amountInput.addEventListener('input', debounce(handleConversion, 500));
    fromCurrencySelect.addEventListener('change', handleConversion);
    toCurrencySelect.addEventListener('change', handleConversion);
    
    // Currency row clicks
    currencyRows.forEach(row => {
        row.addEventListener('click', function() {
            const currency = this.dataset.currency;
            if (currency) {
                fromCurrencySelect.value = currency;
                handleConversion();
            }
        });
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // API tabs
    const apiTabs = document.querySelectorAll('.api-tab');
    apiTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            apiTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Inverse toggle
    const inverseToggle = document.getElementById('inverseToggle');
    if (inverseToggle) {
        inverseToggle.addEventListener('change', function() {
            updateLiveRates(this.checked);
        });
    }
    
    // Show more destinations
    const showMoreBtn = document.querySelector('.show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            // Simulate loading more destinations
            this.textContent = 'Loading...';
            setTimeout(() => {
                this.textContent = 'Show less';
                // In a real app, you would load more destinations here
            }, 1000);
        });
    }
}

// Handle currency conversion
function handleConversion(e) {
    if (e) e.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Validate input
    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        showResult(amount, fromCurrency, toCurrency, amount);
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        try {
            const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
            showResult(amount, fromCurrency, toCurrency, convertedAmount);
        } catch (error) {
            showError('Conversion failed. Please try again.');
            console.error('Conversion error:', error);
        }
    }, 300);
}

// Convert currency using exchange rates
function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    
    if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
        const rate = exchangeRates[fromCurrency][toCurrency];
        return amount * rate;
    }
    
    throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
}

// Show conversion result
function showResult(amount, fromCurrency, toCurrency, convertedAmount) {
    const resultContent = converterResult.querySelector('.result-content');
    const rate = convertedAmount / amount;
    
    resultContent.innerHTML = `
        <div class="conversion-result">
            <div class="converted-amount">
                ${formatCurrency(convertedAmount, toCurrency)}
            </div>
            <div class="conversion-rate">
                1 ${fromCurrency} = ${formatNumber(rate, 5)} ${toCurrency}
            </div>
            <div class="conversion-details">
                ${formatCurrency(amount, fromCurrency)} = ${formatCurrency(convertedAmount, toCurrency)}
            </div>
        </div>
    `;
    
    converterResult.classList.add('show');
    converterResult.classList.remove('error');
}

// Show error message
function showError(message) {
    const resultContent = converterResult.querySelector('.result-content');
    resultContent.innerHTML = `
        <div class="error-message">
            <strong>Error:</strong> ${message}
        </div>
    `;
    
    converterResult.classList.add('show', 'error');
}

// Show loading state
function showLoading() {
    const resultContent = converterResult.querySelector('.result-content');
    resultContent.innerHTML = `
        <div class="loading-state">
            <span class="spinner"></span>
            Converting...
        </div>
    `;
    
    converterResult.classList.add('show');
    converterResult.classList.remove('error');
}

// Swap currencies
function swapCurrencies() {
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;
    
    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;
    
    // Add animation effect
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        swapBtn.style.transform = 'rotate(0deg)';
    }, 300);
    
    // Trigger conversion
    handleConversion();
}

// Update live rates display
function updateLiveRates(inverse = false) {
    const baseCurrency = inverse ? 'EUR' : 'USD';
    const baseAmount = inverse ? 0.86384 : 1;
    
    currencyRows.forEach(row => {
        const currency = row.dataset.currency;
        if (!currency) return;
        
        const rateElement = row.querySelector('.currency-rate');
        const changeElement = row.querySelector('.currency-change');
        
        if (rateElement && changeElement) {
            let rate;
            if (inverse) {
                // Show inverse rates (EUR as base)
                if (currency === 'USD') {
                    rate = 1.1576;
                } else if (exchangeRates.EUR && exchangeRates.EUR[currency]) {
                    rate = exchangeRates.EUR[currency];
                } else {
                    rate = 1;
                }
            } else {
                // Show normal rates (USD as base)
                if (exchangeRates.USD && exchangeRates.USD[currency]) {
                    rate = exchangeRates.USD[currency];
                } else {
                    rate = 1;
                }
            }
            
            rateElement.textContent = formatNumber(rate, currency === 'JPY' ? 2 : 5);
            
            // Update change indicator
            const changeData = currencyChanges[currency];
            if (changeData) {
                const changeValue = changeData.change;
                const trend = changeData.trend;
                
                changeElement.textContent = `${changeValue > 0 ? '+' : ''}${changeValue}%`;
                changeElement.className = `currency-change ${trend}`;
            }
        }
    });
    
    // Update last updated time
    const lastUpdated = document.querySelector('.last-updated');
    if (lastUpdated) {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
            timeZoneName: 'short'
        });
        lastUpdated.innerHTML = `
            <span class="update-icon">🕐</span>
            Last updated ${timeString}
        `;
    }
}

// Utility functions
function formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: currency === 'JPY' ? 0 : 2
    });
    
    return formatter.format(amount);
}

function formatNumber(number, decimals = 2) {
    return parseFloat(number).toFixed(decimals);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Simulate real-time rate updates
function simulateRateUpdates() {
    // Add small random fluctuations to rates
    Object.keys(exchangeRates).forEach(fromCurrency => {
        Object.keys(exchangeRates[fromCurrency]).forEach(toCurrency => {
            const currentRate = exchangeRates[fromCurrency][toCurrency];
            const fluctuation = (Math.random() - 0.5) * 0.001; // ±0.05% fluctuation
            exchangeRates[fromCurrency][toCurrency] = currentRate * (1 + fluctuation);
        });
    });
    
    // Update change percentages
    Object.keys(currencyChanges).forEach(currency => {
        const currentChange = currencyChanges[currency].change;
        const fluctuation = (Math.random() - 0.5) * 0.1; // ±0.05% fluctuation
        const newChange = currentChange + fluctuation;
        
        currencyChanges[currency] = {
            change: parseFloat(newChange.toFixed(3)),
            trend: newChange >= 0 ? 'positive' : 'negative'
        };
    });
    
    updateLiveRates();
}

// Error handling for network issues
window.addEventListener('online', function() {
    console.log('Connection restored');
    // Resume rate updates
    updateLiveRates();
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    showError('Connection lost. Rates may not be current.');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleConversion();
    }
    
    // Ctrl/Cmd + S to swap currencies
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        swapCurrencies();
    }
});

// Form validation
function validateForm() {
    const amount = amountInput.value.trim();
    let isValid = true;
    
    // Remove previous error states
    amountInput.classList.remove('error');
    
    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        amountInput.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Add input formatting
amountInput.addEventListener('input', function() {
    let value = this.value.replace(/[^\d.-]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    this.value = value;
});

// Add focus management for accessibility
function manageFocus() {
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Custom tab handling if needed
            }
        });
    });
}

// Initialize focus management
manageFocus();

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    }
});

if ('PerformanceObserver' in window) {
    performanceObserver.observe({ entryTypes: ['measure'] });
}

// Measure conversion performance
function measureConversionPerformance() {
    performance.mark('conversion-start');
    // Conversion logic here
    performance.mark('conversion-end');
    performance.measure('conversion-duration', 'conversion-start', 'conversion-end');
}

// Export functions for testing (if in a module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertCurrency,
        formatCurrency,
        formatNumber,
        exchangeRates
    };
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // In a real application, you would send this to your analytics service
    console.log('Analytics Event:', eventName, eventData);
}

// Track conversion events
function trackConversion(fromCurrency, toCurrency, amount) {
    trackEvent('currency_conversion', {
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        timestamp: new Date().toISOString()
    });
}

// Add conversion tracking to the main conversion function
const originalHandleConversion = handleConversion;
handleConversion = function(e) {
    const result = originalHandleConversion.call(this, e);
    
    // Track the conversion
    if (!e || e.type !== 'input') { // Don't track real-time input changes
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = parseFloat(amountInput.value);
        
        if (!isNaN(amount) && amount > 0) {
            trackConversion(fromCurrency, toCurrency, amount);
        }
    }
    
    return result;
};

console.log('XE Currency Converter initialized successfully');

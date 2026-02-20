/**
 * O*NET Careers App - Client-side JavaScript
 * Handles dynamic interactions and API calls
 */

// Global app object
window.CareersApp = {
    // Configuration
    config: {
        apiBaseUrl: '/api',
        animationDuration: 300,
        debounceDelay: 300
    },
    
    // State management
    state: {
        currentSearch: null,
        isLoading: false,
        lastSearchType: null
    },
    
    // Initialize the application
    init: function() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupAnimations();
        this.checkSystemHealth();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Form submissions
        const forms = document.querySelectorAll('form[id$="Form"]');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
        
        // Checkbox/radio changes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.handleSelectionChange.bind(this));
        });
        
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.addEventListener('change', this.handleSelectionChange.bind(this));
        });
    },
    
    // Setup form validation
    setupFormValidation: function() {
        // Competency form validation
        const competencyForm = document.getElementById('competencyForm');
        if (competencyForm) {
            const checkboxes = competencyForm.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const selectedCount = competencyForm.querySelectorAll('input[type="checkbox"]:checked').length;
                    const submitBtn = competencyForm.querySelector('button[type="submit"]');
                    
                    if (selectedCount > 3) {
                        this.checked = false;
                        CareersApp.showAlert('Please select exactly 3 competencies', 'warning');
                        return;
                    }
                    
                    submitBtn.disabled = selectedCount !== 3;
                    if (selectedCount === 3) {
                        submitBtn.innerHTML = '<i class="fas fa-search me-2"></i>Find Matching Careers';
                    } else {
                        submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Select ${3 - selectedCount} more competency${3 - selectedCount === 1 ? '' : 'ies'}`;
                    }
                });
            });
        }
        
        // Major form validation
        const majorForm = document.getElementById('majorForm');
        if (majorForm) {
            const radios = majorForm.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.addEventListener('change', function() {
                    const submitBtn = majorForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-search me-2"></i>Find Related Careers';
                });
            });
        }
    },
    
    // Setup animations
    setupAnimations: function() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe cards and sections
        const animatedElements = document.querySelectorAll('.card, .alert, .progress');
        animatedElements.forEach(el => observer.observe(el));
    },
    
    // Handle form submission
    handleFormSubmit: function(e) {
        e.preventDefault();
        
        const form = e.target;
        const formId = form.id;
        
        if (formId === 'competencyForm') {
            this.handleCompetencySearch(form);
        } else if (formId === 'majorForm') {
            this.handleMajorSearch(form);
        } else if (formId === 'quickCompetencyForm') {
            this.handleQuickCompetencySearch(form);
        } else if (formId === 'quickMajorForm') {
            this.handleQuickMajorSearch(form);
        }
    },
    
    // Handle competency search
    handleCompetencySearch: function(form) {
        const selectedCompetencies = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selectedCompetencies.length !== 3) {
            this.showAlert('Please select exactly 3 competencies', 'warning');
            return;
        }
        
        this.searchByCompetencies(selectedCompetencies);
    },
    
    // Handle major search
    handleMajorSearch: function(form) {
        const selectedMajor = form.querySelector('input[type="radio"]:checked');
        
        if (!selectedMajor) {
            this.showAlert('Please select a major', 'warning');
            return;
        }
        
        this.searchByMajor(selectedMajor.value);
    },
    
    // Handle quick competency search
    handleQuickCompetencySearch: function(form) {
        const selectedCompetencies = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selectedCompetencies.length !== 3) {
            this.showAlert('Please select exactly 3 competencies', 'warning');
            return;
        }
        
        this.searchByCompetencies(selectedCompetencies);
    },
    
    // Handle quick major search
    handleQuickMajorSearch: function(form) {
        const selectedMajor = form.querySelector('select').value;
        
        if (!selectedMajor) {
            this.showAlert('Please select a major', 'warning');
            return;
        }
        
        this.searchByMajor(selectedMajor);
    },
    
    // Search by competencies
    searchByCompetencies: async function(competencies) {
        this.setLoadingState(true);
        this.state.currentSearch = { type: 'competencies', data: competencies };
        
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/search/competencies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ competencies })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data.jobs, `Careers matching: ${competencies.join(', ')}`);
            } else {
                this.showAlert(data.error || 'Error searching careers', 'danger');
            }
        } catch (error) {
            this.showAlert('Error searching careers: ' + error.message, 'danger');
        } finally {
            this.setLoadingState(false);
        }
    },
    
    // Search by major
    searchByMajor: async function(major) {
        this.setLoadingState(true);
        this.state.currentSearch = { type: 'major', data: major };
        
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/search/majors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ major })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.displayResults(data.jobs, `Careers related to ${major}`);
            } else {
                this.showAlert(data.error || 'Error searching careers', 'danger');
            }
        } catch (error) {
            this.showAlert('Error searching careers: ' + error.message, 'danger');
        } finally {
            this.setLoadingState(false);
        }
    },
    
    // Display search results
    displayResults: function(jobs, title) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (!resultsSection || !resultsContainer) {
            console.error('Results section not found');
            return;
        }
        
        if (jobs.length === 0) {
            resultsContainer.innerHTML = `
                <div class="alert alert-warning fade-in">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No matching careers found. Try different selections.
                </div>
            `;
        } else {
            let html = `
                <div class="alert alert-success fade-in">
                    <i class="fas fa-check-circle me-2"></i>
                    Found ${jobs.length} matching careers
                </div>
                <div class="row">
            `;
            
            jobs.forEach((job, index) => {
                // Ensure we have a valid onetsoc_code
                if (!job.onetsoc_code) {
                    console.error('Missing onetsoc_code for job:', job);
                    return;
                }
                
                const encodedCode = encodeURIComponent(job.onetsoc_code);
                const delay = index * 100; // Stagger animation
                html += `
                    <div class="col-lg-6 mb-4" style="animation-delay: ${delay}ms">
                        <div class="card h-100 shadow-sm job-card fade-in">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h6 class="card-title mb-0">
                                        <span class="badge bg-primary me-2">${index + 1}</span>
                                        ${job.title}
                                    </h6>
                                    <span class="badge bg-success">${job.match_score}% match</span>
                                </div>
                                <p class="card-text text-muted">
                                    ${job.description.substring(0, 150)}...
                                </p>
                                <div class="d-grid">
                                    <a href="/job/${encodedCode}" class="btn btn-outline-primary">
                                        <i class="fas fa-eye me-2"></i>View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            resultsContainer.innerHTML = html;
        }
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    },
    
    // Set loading state
    setLoadingState: function(isLoading) {
        this.state.isLoading = isLoading;
        
        const buttons = document.querySelectorAll('button[type="submit"], [id$="Btn"]');
        buttons.forEach(button => {
            if (isLoading) {
                button.disabled = true;
                const originalText = button.innerHTML;
                button.setAttribute('data-original-text', originalText);
                button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Searching...';
            } else {
                button.disabled = false;
                const originalText = button.getAttribute('data-original-text');
                if (originalText) {
                    button.innerHTML = originalText;
                    button.removeAttribute('data-original-text');
                }
            }
        });
    },
    
    // Show alert message
    showAlert: function(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert-dismissible');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(alertDiv, mainContent.firstChild);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    },
    
    // Handle selection changes
    handleSelectionChange: function(e) {
        const form = e.target.closest('form');
        if (!form) return;
        
        // Add visual feedback
        const formCheck = e.target.closest('.form-check');
        if (formCheck) {
            formCheck.classList.add('fade-in');
        }
    },
    
    // Check system health
    checkSystemHealth: async function() {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'ok') {
                console.log('System health check passed');
            } else {
                console.warn('System health check failed:', data);
            }
        } catch (error) {
            console.error('System health check error:', error);
        }
    },
    
    // Utility functions
    utils: {
        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Format percentage
        formatPercentage: function(value) {
            return Math.round(value) + '%';
        },
        
        // Truncate text
        truncateText: function(text, length = 100) {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        },
        
        // Generate random ID
        generateId: function() {
            return Math.random().toString(36).substr(2, 9);
        }
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    CareersApp.init();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

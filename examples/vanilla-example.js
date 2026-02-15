/**
 * Vanilla JavaScript Example
 * 
 * This example shows how to use NeuraForm without any framework
 */

import { NeuraFormEngine } from '@neuraform/core';

// Define your form schema
const schema = {
    id: 'contact-form',
    initial: 'contactType',
    states: {
        contactType: {
            id: 'contactType',
            meta: { weight: 1 },
            on: {
                SELECT_SALES: 'salesForm',
                SELECT_SUPPORT: 'supportForm',
                SELECT_GENERAL: 'generalForm'
            }
        },
        salesForm: {
            id: 'salesForm',
            meta: {
                weight: 3,
                validation: [
                    { type: 'required', message: 'Company name is required' }
                ]
            },
            on: { NEXT: 'complete' }
        },
        supportForm: {
            id: 'supportForm',
            meta: {
                weight: 2,
                validation: [
                    { type: 'required', message: 'Issue description is required' }
                ]
            },
            on: { NEXT: 'complete' }
        },
        generalForm: {
            id: 'generalForm',
            meta: { weight: 1 },
            on: { NEXT: 'complete' }
        },
        complete: {
            id: 'complete',
            meta: { weight: 1 }
        }
    }
};

// Initialize the engine
const engine = new NeuraFormEngine({
    schema,
    autoSave: true,
    storageKey: 'contact-form-state',
    onStepChange: (event) => {
        console.log(`Step changed: ${event.from} → ${event.to}`);
        renderCurrentStep();
    },
    onComplete: (context) => {
        console.log('Form completed!', context);
        submitForm(context);
    }
});

// DOM elements
const app = document.getElementById('app');
const progressBar = document.getElementById('progress');
const backButton = document.getElementById('back-button');

// Start the engine
engine.start().then(() => {
    renderCurrentStep();
});

// Render the current step
function renderCurrentStep() {
    const currentState = engine.getCurrentState();
    const context = engine.getContext();
    const progress = engine.getProgress();
    const canGoBack = engine.canGoBack();

    // Update progress bar
    progressBar.style.width = `${progress}%`;

    // Update back button
    backButton.disabled = !canGoBack;

    // Render step content
    switch (currentState) {
        case 'contactType':
            renderContactType();
            break;
        case 'salesForm':
            renderSalesForm(context);
            break;
        case 'supportForm':
            renderSupportForm(context);
            break;
        case 'generalForm':
            renderGeneralForm(context);
            break;
        case 'complete':
            renderComplete(context);
            break;
    }
}

function renderContactType() {
    app.innerHTML = `
    <div class="step">
      <h2>How can we help you?</h2>
      <div class="options">
        <button onclick="selectContactType('SELECT_SALES')" class="option-btn">
          💼 Sales Inquiry
        </button>
        <button onclick="selectContactType('SELECT_SUPPORT')" class="option-btn">
          🛠️ Technical Support
        </button>
        <button onclick="selectContactType('SELECT_GENERAL')" class="option-btn">
          💬 General Question
        </button>
      </div>
    </div>
  `;
}

function renderSalesForm(context) {
    app.innerHTML = `
    <div class="step">
      <h2>Sales Inquiry</h2>
      <form id="sales-form">
        <input
          type="text"
          id="company"
          placeholder="Company Name"
          value="${context.company || ''}"
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          value="${context.email || ''}"
          required
        />
        <textarea
          id="message"
          placeholder="Tell us about your needs"
          required
        >${context.message || ''}</textarea>
        <button type="submit">Continue</button>
      </form>
    </div>
  `;

    document.getElementById('sales-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            company: document.getElementById('company').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        await engine.updateContext(data);
        await engine.transition('NEXT');
    });
}

function renderSupportForm(context) {
    app.innerHTML = `
    <div class="step">
      <h2>Technical Support</h2>
      <form id="support-form">
        <input
          type="email"
          id="email"
          placeholder="Email"
          value="${context.email || ''}"
          required
        />
        <select id="priority" required>
          <option value="">Select Priority</option>
          <option value="low" ${context.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${context.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${context.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <textarea
          id="issue"
          placeholder="Describe your issue"
          required
        >${context.issue || ''}</textarea>
        <button type="submit">Continue</button>
      </form>
    </div>
  `;

    document.getElementById('support-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: document.getElementById('email').value,
            priority: document.getElementById('priority').value,
            issue: document.getElementById('issue').value
        };
        await engine.updateContext(data);
        await engine.transition('NEXT');
    });
}

function renderGeneralForm(context) {
    app.innerHTML = `
    <div class="step">
      <h2>General Question</h2>
      <form id="general-form">
        <input
          type="email"
          id="email"
          placeholder="Email"
          value="${context.email || ''}"
          required
        />
        <textarea
          id="question"
          placeholder="Your question"
          required
        >${context.question || ''}</textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  `;

    document.getElementById('general-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: document.getElementById('email').value,
            question: document.getElementById('question').value
        };
        await engine.updateContext(data);
        await engine.transition('NEXT');
    });
}

function renderComplete(context) {
    app.innerHTML = `
    <div class="step complete">
      <h2>✅ Thank You!</h2>
      <p>We've received your message and will get back to you soon.</p>
      <div class="summary">
        <h3>Summary:</h3>
        <pre>${JSON.stringify(context, null, 2)}</pre>
      </div>
      <button onclick="resetForm()">Submit Another</button>
    </div>
  `;
}

// Global functions (for onclick handlers)
window.selectContactType = async (type) => {
    await engine.transition(type, { contactType: type });
};

window.resetForm = async () => {
    await engine.reset();
};

// Back button handler
backButton.addEventListener('click', async () => {
    await engine.back();
});

// Submit form to backend
async function submitForm(data) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log('Form submitted successfully', await response.json());
    } catch (error) {
        console.error('Failed to submit form', error);
    }
}

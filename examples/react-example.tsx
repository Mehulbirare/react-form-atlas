import React from 'react';
import { useReactForm } from 'react-form-bridge';
import type { FormSchema } from 'react-form-engine';

// Import your schema
import onboardingSchema from './onboarding-schema.json';

const schema = onboardingSchema as FormSchema;

export function OnboardingFlow() {
    const {
        currentState,
        context,
        progress,
        canGoBack,
        transition,
        back,
        updateContext,
        isReady
    } = useReactForm({
        schema,
        autoSave: true,
        storageKey: 'my-onboarding-flow',
        onComplete: (data: any) => {
            console.log('Onboarding complete!', data);
            // Submit to your backend
        },
        onStepChange: (event: any) => {
            // Track analytics
            console.log('Step changed:', event);
        }
    });

    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div className="onboarding-container">
            {/* Progress Bar */}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step Content */}
            <div className="step-content">
                {currentState === 'welcome' && (
                    <WelcomeStep
                        onNext={() => transition('NEXT')}
                    />
                )}

                {currentState === 'userType' && (
                    <UserTypeStep
                        value={context.userType}
                        onSelect={(type) => {
                            updateContext({ userType: type });
                            transition(
                                type === 'business' ? 'SELECT_BUSINESS' : 'SELECT_INDIVIDUAL',
                                { userType: type }
                            );
                        }}
                    />
                )}

                {currentState === 'businessDetails' && (
                    <BusinessDetailsStep
                        value={context.businessDetails}
                        onChange={(data) => updateContext({ businessDetails: data })}
                        onNext={() => transition('NEXT')}
                    />
                )}

                {currentState === 'personalDetails' && (
                    <PersonalDetailsStep
                        value={context.personalDetails}
                        onChange={(data) => updateContext({ personalDetails: data })}
                        onNext={() => transition('NEXT')}
                    />
                )}

                {currentState === 'taxInfo' && (
                    <TaxInfoStep
                        value={context.taxInfo}
                        onChange={(data) => updateContext({ taxInfo: data })}
                        onNext={() => transition('NEXT')}
                    />
                )}

                {currentState === 'preferences' && (
                    <PreferencesStep
                        value={context.preferences}
                        onChange={(data) => updateContext({ preferences: data })}
                        onNext={() => transition('NEXT')}
                    />
                )}

                {currentState === 'complete' && (
                    <CompleteStep data={context} />
                )}
            </div>

            {/* Navigation */}
            <div className="navigation">
                {canGoBack && (
                    <button onClick={back}>
                        Back
                    </button>
                )}
            </div>
        </div>
    );
}

// Example step components
function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <div>
            <h1>Welcome to Our Platform!</h1>
            <p>Let's get you set up in just a few steps.</p>
            <button onClick={onNext}>Get Started</button>
        </div>
    );
}

function UserTypeStep({
    value,
    onSelect
}: {
    value?: string;
    onSelect: (type: string) => void;
}) {
    return (
        <div>
            <h2>What type of account do you need?</h2>
            <div className="options">
                <button
                    className={value === 'business' ? 'selected' : ''}
                    onClick={() => onSelect('business')}
                >
                    Business Account
                </button>
                <button
                    className={value === 'individual' ? 'selected' : ''}
                    onClick={() => onSelect('individual')}
                >
                    Individual Account
                </button>
            </div>
        </div>
    );
}

function BusinessDetailsStep({
    value,
    onChange,
    onNext
}: {
    value?: any;
    onChange: (data: any) => void;
    onNext: () => void;
}) {
    return (
        <div>
            <h2>Business Details</h2>
            <input
                type="text"
                placeholder="Company Name"
                value={value?.companyName || ''}
                onChange={(e) => onChange({ ...value, companyName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Industry"
                value={value?.industry || ''}
                onChange={(e) => onChange({ ...value, industry: e.target.value })}
            />
            <button onClick={onNext}>Continue</button>
        </div>
    );
}

function PersonalDetailsStep({
    value,
    onChange,
    onNext
}: {
    value?: any;
    onChange: (data: any) => void;
    onNext: () => void;
}) {
    return (
        <div>
            <h2>Personal Details</h2>
            <input
                type="text"
                placeholder="Full Name"
                value={value?.fullName || ''}
                onChange={(e) => onChange({ ...value, fullName: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={value?.email || ''}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
            />
            <button onClick={onNext}>Continue</button>
        </div>
    );
}

function TaxInfoStep({
    value,
    onChange,
    onNext
}: {
    value?: any;
    onChange: (data: any) => void;
    onNext: () => void;
}) {
    return (
        <div>
            <h2>Tax Information</h2>
            <input
                type="text"
                placeholder="Tax ID"
                value={value?.taxId || ''}
                onChange={(e) => onChange({ ...value, taxId: e.target.value })}
            />
            <button onClick={onNext}>Continue</button>
        </div>
    );
}

function PreferencesStep({
    value,
    onChange,
    onNext
}: {
    value?: any;
    onChange: (data: any) => void;
    onNext: () => void;
}) {
    return (
        <div>
            <h2>Preferences</h2>
            <label>
                <input
                    type="checkbox"
                    checked={value?.newsletter || false}
                    onChange={(e) => onChange({ ...value, newsletter: e.target.checked })}
                />
                Subscribe to newsletter
            </label>
            <button onClick={onNext}>Complete</button>
        </div>
    );
}

function CompleteStep({ data }: { data: any }) {
    return (
        <div>
            <h2>All Done! 🎉</h2>
            <p>Your account has been created successfully.</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}



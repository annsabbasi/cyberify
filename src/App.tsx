import { useState } from 'react';
import { FormField } from './components/Form/FormField';
import { Dialog } from './components/Dialog/Dialog';
import type { FormData, FormErrors, ApiResponse, CheckEmailResponse } from './types';
import './App.css';

const API_BASE = '/api/submissions';

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First check if email already exists
      const checkResponse = await fetch(
        `${API_BASE}/check/${encodeURIComponent(formData.email.trim().toLowerCase())}`
      );
      const checkData: CheckEmailResponse = await checkResponse.json();

      if (checkData.exists) {
        setDialog({
          isOpen: true,
          title: 'Already Submitted',
          message: 'You have already submitted this form.',
          type: 'error'
        });
        setIsSubmitting(false);
        return;
      }

      // Submit the form
      const submitResponse = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const submitData: ApiResponse = await submitResponse.json();

      if (submitResponse.status === 409) {
        setDialog({
          isOpen: true,
          title: 'Already Submitted',
          message: submitData.error || 'You have already submitted this form.',
          type: 'error'
        });
      } else if (!submitResponse.ok) {
        if (submitData.errors) {
          const fieldErrors: FormErrors = {};
          submitData.errors.forEach((err) => {
            fieldErrors[err.field as keyof FormErrors] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setDialog({
            isOpen: true,
            title: 'Error',
            message: submitData.error || 'An error occurred. Please try again.',
            type: 'error'
          });
        }
      } else {
        setDialog({
          isOpen: true,
          title: 'Success!',
          message: 'Your response has been recorded. Thank you!',
          type: 'success'
        });
        // Reset form on success
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setDialog({
        isOpen: true,
        title: 'Error',
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Contact Form</h1>
          <p className="form-description">
            Please fill out the form below. All fields are required.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Enter your full name"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter your email address"
          />

          <FormField
            label="Message"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            required
            placeholder="Enter your message (minimum 10 characters)"
          />

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onClose={closeDialog}
      />
    </div>
  );
}

export default App;

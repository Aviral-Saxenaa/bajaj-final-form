import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormResponse, FormSection as FormSectionType } from '../types/form';
import { getForm } from '../services/api';
import FormSection from './FormSection';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const DynamicForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [formStructure, setFormStructure] = useState<FormResponse['form'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const rollNumber = localStorage.getItem('rollNumber');
    if (!rollNumber) {
      navigate('/login');
      return;
    }

    const fetchForm = async () => {
      try {
        const response = await getForm(rollNumber);
        setFormStructure(response.form);
      } catch (err) {
        setError('Failed to load form. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [navigate]);

  const validateSection = (section: FormSectionType) => {
    const newErrors: Record<string, string> = {};

    section.fields.forEach(field => {
      const value = formData[field.fieldId];
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || 'This field is required';
      } else if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
        newErrors[field.fieldId] = field.validation?.message || `Minimum length is ${field.minLength} characters`;
      } else if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        newErrors[field.fieldId] = field.validation?.message || `Maximum length is ${field.maxLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));

    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (!formStructure) return;
    const currentSectionData = formStructure.sections[currentSection];
    if (validateSection(currentSectionData)) {
      if (currentSection === formStructure.sections.length - 1) {
        console.log('Form Data:', formData);
        setIsSubmitted(true);
      } else {
        setCurrentSection(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => setCurrentSection(prev => prev - 1);

  const handleReturnToLogin = () => {
    localStorage.removeItem('rollNumber');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  if (error || !formStructure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-red-600 text-lg font-semibold">{error || 'Failed to load form'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-md px-8 py-10 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted!</h2>
        <p className="text-gray-500 mb-6">Thanks for completing the form.</p>
        <button
          onClick={handleReturnToLogin}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const currentSectionData = formStructure.sections[currentSection];

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">{formStructure.formTitle}</h1>
        <p className="text-sm text-gray-500 mt-1">Form ID: {formStructure.formId}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">
            Section {currentSection + 1} of {formStructure.sections.length}
          </p>
          <div className="flex-1 mx-4 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentSection + 1) / formStructure.sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <FormSection
        section={currentSectionData}
        formData={formData}
        onChange={handleFieldChange}
        errors={errors}
      />

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          className={`px-4 py-2 rounded flex items-center text-sm transition ${
            currentSection === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          disabled={currentSection === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center text-sm font-medium"
        >
          {currentSection === formStructure.sections.length - 1 ? (
            'Submit'
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DynamicForm;

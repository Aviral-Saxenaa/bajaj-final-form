import React from 'react';
import { FormSection as FormSectionType } from '../types/form';
import FormField from './FormField';

interface FormSectionProps {
  section: FormSectionType;
  formData: Record<string, string | string[]>;
  onChange: (fieldId: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl px-8 sm:px-10 py-10 sm:py-12 mx-auto font-dm-sans transition-all duration-300">
      
      {/* Header */}
      <div className="mb-10 border-b pb-6 border-gray-200">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 tracking-tight">
          {section.title}
        </h2>
        <p className="text-gray-500 text-md sm:text-lg leading-relaxed">{section.description}</p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-8">
        {section.fields.map((field) => (
          <FormField
            key={field.fieldId}
            field={field}
            value={formData[field.fieldId] || (field.type === 'checkbox' ? [] : '')}
            onChange={(value) => onChange(field.fieldId, value)}
            error={errors[field.fieldId]}
          />
        ))}
      </div>

      {/* Footer spacing if needed */}
      <div className="mt-10" />
    </div>
  );
};

export default FormSection;

import './FormField.css';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder
}: FormFieldProps) {
  const inputId = `field-${name}`;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={inputId} className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          className="form-field__textarea"
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="form-field__input"
          placeholder={placeholder}
        />
      )}

      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}

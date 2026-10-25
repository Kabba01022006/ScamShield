import { useState, useCallback } from 'react';

/**
 * useForm: Lightweight accessible form state management hook.
 *
 * Validation strategy:
 * 1. On blur: Marks the field as touched and calculates validation error for that field.
 * 2. On change (after touched): Re-validates the field live to provide immediate positive feedback.
 * 3. On submit: Marks all fields as touched, runs full form validation, and automatically
 *    focuses the first invalid input element to ensure high accessibility.
 */
export const useForm = ({ initialValues = {}, validate, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set field value directly if needed
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const nextVal = type === 'checkbox' ? checked : value;

      setValues((prev) => {
        const nextValues = { ...prev, [name]: nextVal };

        // If field was already touched, re-validate live
        if (touched[name] && validate) {
          const validationErrors = validate(nextValues);
          setErrors((prevErr) => ({
            ...prevErr,
            [name]: validationErrors[name] || '',
          }));
        }

        return nextValues;
      });
    },
    [touched, validate]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validate) {
        const validationErrors = validate(values);
        setErrors((prevErr) => ({
          ...prevErr,
          [name]: validationErrors[name] || '',
        }));
      }
    },
    [validate, values]
  );

  // Reset form
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // Handle submit with auto-focus on first invalid field
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Run validation
      let validationErrors = {};
      if (validate) {
        validationErrors = validate(values);
      }
      setErrors(validationErrors);

      const errorKeys = Object.keys(validationErrors).filter(
        (key) => Boolean(validationErrors[key])
      );

      if (errorKeys.length > 0) {
        // Accessibility: auto-focus the first invalid field
        const firstErrorKey = errorKeys[0];
        const element = document.getElementById(firstErrorKey) || document.querySelector(`[name="${firstErrorKey}"]`);
        if (element && typeof element.focus === 'function') {
          element.focus();
        }
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    setErrors,
    resetForm,
  };
};

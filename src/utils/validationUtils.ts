// utils/validateField.js

export function validateField(question, value, isRequired) {
  const fieldId = question.fieldId;
  const errors = [];

  // Required field validation
  if (
    isRequired &&
    (value === null || value === undefined || value.toString().trim() === "")
  ) {
    errors.push("This field is required.");
  }

  // Type-specific validations
  switch (question.type) {
    case "text":
      // Email validation for specific fieldIds
      if (["email", "secondaryEmail"].includes(fieldId)) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailPattern.test(value)) {
          errors.push("Please enter a valid email address.");
        }
      }
      break;

    case "phone":
      // Simple phone number validation
      const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/; // Matches (123) 456-7890
      if (value && !phonePattern.test(value)) {
        errors.push("Please enter a valid phone number.");
      }
      break;

    case "number":
    case "currency":
      if (value === null || value === undefined || value === "") {
        if (isRequired) {
          errors.push("This field is required.");
        }
      } else if (isNaN(value)) {
        errors.push("This field must be a number.");
      } else if (Number(value) < 0) {
        errors.push("Value cannot be negative.");
      }
      break;

    case "date":
      // Date validation
      if (value && isNaN(Date.parse(value))) {
        errors.push("Please enter a valid date.");
      }
      break;

    case "select":
    case "boolean":
      if (
        isRequired &&
        (value === null || value === undefined || value === "")
      ) {
        errors.push("This field is required.");
      }
      break;

    // Add more cases as needed

    default:
      break;
  }

  return errors;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(value: string) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
}

export function isValidIraqPhone(value: string): boolean {
  // Iraq phone format: 07(3|7|8|9)[0-9]{7}
  const cleaned = value.replace(/\s+/g, "");
  return /^07(3|7|8|9)[0-9]{7}$/.test(cleaned);
}

export type Role = "admin" | "user";

export function isValidRole(role: string): role is Role {
  return role === "admin" || role === "user";
}

export function safeString(value?: string | null) {
  return (value ?? "").trim();
}

export function validateFieldValue(
  value: any,
  fieldType: string,
  required?: boolean,
  min?: number,
  max?: number,
  regex?: string,
): { valid: boolean; error?: string } {
  // Check required
  if (required) {
    if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      return { valid: false, error: "This field is required" };
    }
  }

  // If not required and empty, it's valid
  if (!required && (value === null || value === undefined || value === "")) {
    return { valid: true };
  }

  // Type-specific validation
  switch (fieldType) {
    case "email":
      if (value && !isValidEmail(value)) {
        return { valid: false, error: "Please enter a valid email address" };
      }
      break;

    case "phone":
      if (value && !isValidIraqPhone(value)) {
        return { valid: false, error: "Please enter a valid Iraq phone number (07XXXXXXXX)" };
      }
      break;

    case "number":
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { valid: false, error: "Please enter a valid number" };
      }
      if (min !== undefined && numValue < min) {
        return { valid: false, error: `Value must be at least ${min}` };
      }
      if (max !== undefined && numValue > max) {
        return { valid: false, error: `Value must be at most ${max}` };
      }
      break;

    case "rating":
      const ratingValue = Number(value);
      if (isNaN(ratingValue) || ratingValue < 1 || (max !== undefined && ratingValue > max)) {
        return { valid: false, error: `Rating must be between 1 and ${max ?? 5}` };
      }
      break;

    case "range":
      const rangeValue = Number(value);
      if (isNaN(rangeValue)) {
        return { valid: false, error: "Please enter a valid number" };
      }
      if (min !== undefined && rangeValue < min) {
        return { valid: false, error: `Value must be at least ${min}` };
      }
      if (max !== undefined && rangeValue > max) {
        return { valid: false, error: `Value must be at most ${max}` };
      }
      break;

    case "date":
      if (value && isNaN(Date.parse(value))) {
        return { valid: false, error: "Please enter a valid date" };
      }
      break;

    case "time":
      if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        return { valid: false, error: "Please enter a valid time (HH:MM)" };
      }
      break;
  }

  // Regex validation
  if (regex && value && typeof value === "string") {
    try {
      const regexObj = new RegExp(regex);
      if (!regexObj.test(value)) {
        return { valid: false, error: "Value does not match the required format" };
      }
    } catch {
      // Invalid regex, skip
    }
  }

  return { valid: true };
}

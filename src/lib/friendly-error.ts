export function friendlyError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const e = err as { code?: string; message?: string } | null | undefined;
  if (!e) return fallback;
  switch (e.code) {
    case "23505":
      return "This record already exists.";
    case "23503":
      return "Related record is missing or invalid.";
    case "23514":
      return "The information provided is not valid.";
    case "42501":
    case "PGRST301":
      return "You don't have permission to do that.";
    case "PGRST116":
      return "Item not found.";
    case "invalid_credentials":
      return "Invalid email or password.";
    case "email_not_confirmed":
      return "Please confirm your email to continue.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "user_already_exists":
      return "An account with this email already exists.";
    case "weak_password":
      return "Password is too weak. Use at least 8 characters with a mix of letters and numbers.";
    default:
      break;
  }
  // Allow short, generic auth messages through; suppress long/raw DB strings.
  if (e.message && e.message.length < 80 && !/relation|column|policy|constraint|schema|sql/i.test(e.message)) {
    return e.message;
  }
  return fallback;
}
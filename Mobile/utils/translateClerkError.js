const clerkErrorMessages = {
  form_identifier_not_found: "Adresse e-mail introuvable.",
  form_password_incorrect: "Mot de passe incorrect.",
  form_password_too_short: "Mot de passe trop court.",
  form_password_pwned: "Mot de passe compromis. Veuillez en choisir un autre.",
  form_identifier_exists: "Cette adresse est déjà utilisée.",
  form_param_format_invalid: "Format invalide dans le formulaire.",
  strategy_for_user_invalid:
    "Ce compte utilise Google. Veuillez vous connecter avec Google.",
};

/**
 * Retourne un message d'erreur lisible à partir du code Clerk
 */
export default function getClerkErrorMessage(code, fallback = "Une erreur s'est produite.") {
  if (code && clerkErrorMessages[code]) {
    return clerkErrorMessages[code];
  }
  return fallback;
}

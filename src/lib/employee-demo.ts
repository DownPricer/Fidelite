/** Mode démo employé : actif en local sans session (pas de base requise). */
export function isEmployeeDevDemo(session: unknown) {
  return process.env.NODE_ENV === "development" && !session;
}

export const EMPLOYEE_DEMO_COOKIE = "fife_employee_demo";

export function isEmployeeDemoCookie(value: string | undefined) {
  return process.env.NODE_ENV === "development" && value === "1";
}

import type { MerchantRole, StaffPreset } from "@prisma/client";

export type PermissionKey =
  | "caisse"
  | "viewCustomers"
  | "viewHistory"
  | "addPoints"
  | "redeemReward"
  | "correctTransaction"
  | "manageEmployees"
  | "editProgram"
  | "sensitiveSettings"
  | "viewStatistics";

export type StaffPermissions = Record<PermissionKey, boolean>;

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  caisse: "Accès à la caisse",
  viewCustomers: "Consultation des clients",
  viewHistory: "Consultation de l'historique",
  addPoints: "Ajout de points ou passages",
  redeemReward: "Utilisation d'une récompense",
  correctTransaction: "Annulation ou correction",
  manageEmployees: "Gestion des employés",
  editProgram: "Modification du programme",
  sensitiveSettings: "Accès aux réglages sensibles",
  viewStatistics: "Consultation des statistiques",
};

export const PERMISSION_KEYS = Object.keys(PERMISSION_LABELS) as PermissionKey[];
export const CRITICAL_PERMISSION_KEYS: PermissionKey[] = [
  "caisse",
  "addPoints",
  "redeemReward",
  "manageEmployees",
  "sensitiveSettings",
];

const ADMIN_PERMISSIONS: StaffPermissions = {
  caisse: true,
  viewCustomers: true,
  viewHistory: true,
  addPoints: true,
  redeemReward: true,
  correctTransaction: true,
  manageEmployees: true,
  editProgram: true,
  sensitiveSettings: true,
  viewStatistics: true,
};

const MANAGER_DEFAULT: StaffPermissions = {
  caisse: true,
  viewCustomers: true,
  viewHistory: true,
  addPoints: true,
  redeemReward: true,
  correctTransaction: true,
  manageEmployees: false,
  editProgram: false,
  sensitiveSettings: false,
  viewStatistics: false,
};

const CASHIER_DEFAULT: StaffPermissions = {
  caisse: true,
  viewCustomers: false,
  viewHistory: false,
  addPoints: true,
  redeemReward: true,
  correctTransaction: false,
  manageEmployees: false,
  editProgram: false,
  sensitiveSettings: false,
  viewStatistics: false,
};

export function presetPermissions(preset: StaffPreset): StaffPermissions {
  if (preset === "MANAGER") return { ...MANAGER_DEFAULT };
  if (preset === "CASHIER") return { ...CASHIER_DEFAULT };
  return { ...CASHIER_DEFAULT };
}

export function resolvePermissions(input: {
  role: MerchantRole;
  staffPreset: StaffPreset;
  permissions?: unknown;
}): StaffPermissions {
  if (input.role === "MERCHANT_ADMIN") return { ...ADMIN_PERMISSIONS };
  const base = presetPermissions(input.staffPreset);
  if (input.permissions && typeof input.permissions === "object" && !Array.isArray(input.permissions)) {
    const raw = input.permissions as Partial<StaffPermissions>;
    for (const key of PERMISSION_KEYS) {
      if (typeof raw[key] === "boolean") base[key] = raw[key]!;
    }
  }
  return base;
}

export function sanitizeStaffPermissions(input: unknown): StaffPermissions {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Permissions invalides.");
  }
  const raw = input as Record<string, unknown>;
  const unknown = Object.keys(raw).filter((key) => !PERMISSION_KEYS.includes(key as PermissionKey));
  if (unknown.length) {
    throw new Error(`Permission inconnue : ${unknown[0]}`);
  }
  const next = { ...CASHIER_DEFAULT };
  for (const key of PERMISSION_KEYS) {
    if (typeof raw[key] !== "boolean") {
      throw new Error(`Permission invalide : ${key}`);
    }
    next[key] = raw[key] as boolean;
  }
  return next;
}

export function hasPermission(
  membership: { role: MerchantRole; staffPreset: StaffPreset; permissions?: unknown },
  key: PermissionKey,
) {
  return resolvePermissions(membership)[key];
}

export function presetLabel(preset: StaffPreset, role: MerchantRole) {
  if (role === "MERCHANT_ADMIN") return "Administrateur";
  if (role === "EMPLOYEE") return "Employé";
  if (preset === "MANAGER") return "Responsable";
  if (preset === "CASHIER") return "Employé de caisse";
  return "Personnalisé";
}

export function statusLabel(input: {
  isActive: boolean;
  userActive: boolean;
  invitationStatus: string;
}) {
  if (input.invitationStatus === "CANCELLED") return "Accès retiré";
  if (!input.isActive || !input.userActive) return "Suspendu";
  if (input.invitationStatus === "PENDING") return "Invitation en attente";
  return "Actif";
}

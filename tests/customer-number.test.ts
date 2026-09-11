import { describe, expect, it } from "vitest";
import {
  deriveClientNumber,
  normalizeCustomerNumber,
  resolveClientNumber,
} from "../src/lib/client-number";

describe("normalizeCustomerNumber", () => {
  it("accepte les formats affichés sur la carte", () => {
    expect(normalizeCustomerNumber("482917")).toBe("482917");
    expect(normalizeCustomerNumber("482 917")).toBe("482917");
    expect(normalizeCustomerNumber("482-917")).toBe("482917");
    expect(normalizeCustomerNumber("#482917")).toBe("482917");
  });
});

describe("resolveClientNumber", () => {
  it("utilise le numéro stocké quand il existe", () => {
    expect(
      resolveClientNumber({ clientNumber: "482 917", userId: "user_abc" }),
    ).toBe("482917");
  });

  it("retombe sur le numéro dérivé de l'id utilisateur", () => {
    const userId = "user_without_stored_number";
    expect(resolveClientNumber({ clientNumber: null, userId })).toBe(
      deriveClientNumber(userId),
    );
  });
});

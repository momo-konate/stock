/**
 * Utilitaires partagés par les tests des controllers.
 * (Ce fichier n'est PAS un fichier de test : pas de suffixe .test)
 */
import { vi } from "vitest";

// Simule un objet réponse Express (res.status(...).json(...)).
export const mockRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

// Erreur générique pour tester les blocs catch.
export const boom = new Error("db down");

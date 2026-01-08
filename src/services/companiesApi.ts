import api from "./api";
import { Company } from "@/types";

// Cache pour les entreprises (15 minutes)
interface CacheEntry {
  data: Company[];
  timestamp: number;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes en millisecondes
let companiesCache: CacheEntry | null = null;

// Service pour la gestion des entreprises
export const companiesService = {
  // Récupérer toutes les entreprises (avec cache de 15 minutes)
  getAllCompanies: async (): Promise<Company[]> => {
    // Vérifier si le cache est valide
    const now = Date.now();
    if (companiesCache && (now - companiesCache.timestamp) < CACHE_DURATION) {
      console.log("✅ [COMPANIES API] Données récupérées depuis le cache");
      return companiesCache.data;
    }

    try {
      const response = await api.get<Company[]>('/companies');
      // Mettre à jour le cache
      companiesCache = {
        data: response.data,
        timestamp: now,
      };
      console.log("✅ [COMPANIES API] Données récupérées depuis l'API et mises en cache");
      return response.data;
    } catch (error: any) {
      // Si erreur mais qu'on a des données en cache (même expirées), les retourner
      if (companiesCache) {
        console.warn("⚠️ [COMPANIES API] Erreur API, utilisation des données en cache (peut être expirées)");
        return companiesCache.data;
      }
      
      console.error("❌ [COMPANIES API] Erreur lors de la récupération des entreprises:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Récupérer une entreprise par son ID
  getCompanyById: async (id: number): Promise<Company> => {
    try {
      const response = await api.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ [COMPANIES API] Erreur lors de la récupération de l'entreprise ${id}:`, error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Rechercher une entreprise par nom
  searchByName: async (name: string): Promise<Company[]> => {
    try {
      const response = await api.get<Company[]>('/companies/search-by-name', {
        params: { name },
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ [COMPANIES API] Erreur lors de la recherche par nom:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Recherche avancée par critères
  search: async (criteria: Record<string, any>): Promise<Company[]> => {
    try {
      const response = await api.post<Company[]>('/companies/search', criteria);
      return response.data;
    } catch (error: any) {
      console.error("❌ [COMPANIES API] Erreur lors de la recherche avancée:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};


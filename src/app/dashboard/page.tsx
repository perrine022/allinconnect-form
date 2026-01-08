'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Loader2, AlertCircle, Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { companiesService } from '@/services/companiesApi';
import { Company } from '@/types';

type SortField = string;
type SortDirection = 'asc' | 'desc' | null;

export default function DashboardPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  
  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState<SortField>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesService.getAllCompanies();
      setCompanies(data);
      
      // Extraire toutes les colonnes uniques de toutes les entreprises
      if (data.length > 0) {
        const allKeys = new Set<string>();
        data.forEach((company) => {
          Object.keys(company).forEach((key) => {
            if (key !== 'sireneData' && key !== 'chatGptData') {
              allKeys.add(key);
            }
          });
          if (company.sireneData) {
            Object.keys(company.sireneData).forEach((key) => {
              allKeys.add(`sireneData.${key}`);
            });
          }
          if (company.chatGptData) {
            Object.keys(company.chatGptData).forEach((key) => {
              allKeys.add(`chatGptData.${key}`);
            });
          }
        });
        
        // Colonnes prioritaires dans l'ordre spécifié
        const priorityColumns = [
          // 1-3: Colonnes principales
          'name',
          'sireneData.siret',
          'chatGptData.mainSector',
          // 4ème colonne et suivantes: Informations détaillées
          'chatGptData.businessSegment', // B2B / B2C / B2G
          'chatGptData.ownership', // Actionnariat
          'chatGptData.isInCollectiveProcedure', // Procédure collective
          'sireneData.activitePrincipaleNAF25UniteLegale', // Code NAF
          'sireneData.activitePrincipaleNAF25Etablissement', // Code NAF (établissement)
          'chatGptData.subSector', // Secteurs
          'chatGptData.employees', // Nombre d'employés
          'chatGptData.employeeCount', // Nombre d'employés (texte)
          'chatGptData.extraKeywords', // Mots clés supplémentaires
          'chatGptData.isInternational', // International
          'chatGptData.continent', // Continent
          'chatGptData.country', // Pays
          'chatGptData.region', // Région
          'chatGptData.department', // Département
          'chatGptData.annualRevenue', // Chiffre d'affaires annuel
          'chatGptData.companyAgeYears', // Ancienneté (années)
          'chatGptData.seniorityYears', // Ancienneté alternative
          'chatGptData.registeredTrademarks', // Marques déposées
          'chatGptData.patentsInnovations', // Brevets / innovations
          'chatGptData.specificExpertise', // Savoir-faire spécifique identifié
        ];
        
        const sortedKeys = Array.from(allKeys).sort();
        
        // Réorganiser : mettre les colonnes prioritaires dans l'ordre spécifié
        const orderedColumns: string[] = [];
        const otherColumns: string[] = [];
        
        // Ajouter les colonnes prioritaires dans l'ordre
        priorityColumns.forEach(col => {
          if (sortedKeys.includes(col)) {
            orderedColumns.push(col);
          }
        });
        
        // Ajouter les autres colonnes triées alphabétiquement
        sortedKeys.forEach(col => {
          if (!priorityColumns.includes(col)) {
            otherColumns.push(col);
          }
        });
        
        setColumns([...orderedColumns, ...otherColumns]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des entreprises';
      setError(errorMessage);
      console.error('Erreur lors du chargement des entreprises:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la valeur d'une colonne (gère les chemins imbriqués)
  const getColumnValue = (company: Company, column: string): any => {
    if (column.includes('.')) {
      const [parent, child] = column.split('.');
      if (parent === 'sireneData' && company.sireneData) {
        return (company.sireneData as any)[child];
      }
      if (parent === 'chatGptData' && company.chatGptData) {
        return (company.chatGptData as any)[child];
      }
      return undefined;
    }
    return (company as any)[column];
  };

  // Filtrer et trier les entreprises
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = [...companies];

    // Recherche globale
    if (searchTerm) {
      filtered = filtered.filter((company) => {
        return columns.some((col) => {
          const value = getColumnValue(company, col);
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Filtre par colonne spécifique
    if (selectedColumn && filterValue) {
      filtered = filtered.filter((company) => {
        const value = getColumnValue(company, selectedColumn);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    }

    // Tri
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = getColumnValue(a, sortField);
        const bValue = getColumnValue(b, sortField);
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [companies, searchTerm, selectedColumn, filterValue, sortField, sortDirection, columns]);

  // Calculer le montant total
  const calculateTotalAmount = (): number => {
    return filteredAndSortedCompanies.reduce((sum, company) => {
      const annualRevenue = company.chatGptData?.annualRevenue;
      if (typeof annualRevenue === 'number' && !isNaN(annualRevenue)) {
        return sum + annualRevenue;
      }
      return sum;
    }, 0);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (Array.isArray(value)) {
      if (value.length === 0) return '-';
      if (value.length <= 3) return value.join(', ');
      return `${value.slice(0, 3).join(', ')}... (+${value.length - 3})`;
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '-';
      return `{${keys.length} champ${keys.length > 1 ? 's' : ''}}`;
    }
    if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...';
    return String(value);
  };

  const handleSort = (column: string) => {
    if (sortField === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField('');
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedColumn('');
    setFilterValue('');
    setSortField('');
    setSortDirection(null);
  };

  const totalAmount = calculateTotalAmount();
  const hasActiveFilters = searchTerm || selectedColumn || sortField;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AllInConnect</h1>
                <p className="text-sm text-gray-600">Backoffice de gestion</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant total des entreprises</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalAmount > 0 
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)
                    : '-'}
                </p>
              </div>
              <div className="bg-red-50 rounded-full p-4">
                <Building2 className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{filteredAndSortedCompanies.length}</span> entreprise{filteredAndSortedCompanies.length > 1 ? 's' : ''} affichée{filteredAndSortedCompanies.length > 1 ? 's' : ''}
                {companies.length !== filteredAndSortedCompanies.length && (
                  <span className="text-gray-500"> sur {companies.length}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadCompanies}
              className="ml-auto text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-red-600 animate-spin mb-4" />
            <p className="text-gray-600">Chargement des entreprises...</p>
          </div>
        )}

        {/* Companies Table */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            {/* Filtres et recherche */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col gap-4">
                {/* Barre de recherche globale */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher dans toutes les colonnes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                      showFilters || hasActiveFilters
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filtres
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Réinitialiser
                    </button>
                  )}
                </div>

                {/* Panneau de filtres avancés */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrer par colonne
                      </label>
                      <select
                        value={selectedColumn}
                        onChange={(e) => {
                          setSelectedColumn(e.target.value);
                          setFilterValue('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Toutes les colonnes</option>
                        {columns.map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedColumn && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valeur du filtre
                        </label>
                        <input
                          type="text"
                          placeholder="Entrez une valeur..."
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            {filteredAndSortedCompanies.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune entreprise trouvée</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column) => {
                        const isSorted = sortField === column;
                        const sortIcon = isSorted ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        );
                        
                        return (
                          <th
                            key={column}
                            onClick={() => handleSort(column)}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {column}
                              <span className="text-gray-400">
                                {isSorted ? sortIcon : <ArrowUpDown className="h-4 w-4" />}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedCompanies.map((company, index) => (
                      <tr
                        key={company.id || index}
                        onClick={() => company.id && router.push(`/dashboard/company/${company.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {columns.map((column) => (
                          <td
                            key={`${company.id || index}-${column}`}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {formatValue(getColumnValue(company, column))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

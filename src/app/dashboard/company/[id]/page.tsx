'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, Loader2, AlertCircle, ArrowLeft, MapPin, Users, Euro, Calendar, FileText, TrendingUp, Shield } from 'lucide-react';
import { companiesService } from '@/services/companiesApi';
import { Company } from '@/types';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      loadCompany();
    }
  }, [companyId]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesService.getCompanyById(Number(companyId));
      setCompany(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement de l\'entreprise';
      setError(errorMessage);
      console.error('Erreur lors du chargement de l\'entreprise:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (Array.isArray(value)) {
      if (value.length === 0) return '-';
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
        <Icon className="h-5 w-5 text-red-600" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: any }) => {
    const formattedValue = typeof value === 'number' && (label.toLowerCase().includes('revenue') || label.toLowerCase().includes('montant') || label.toLowerCase().includes('ebitda') || label.toLowerCase().includes('debt'))
      ? formatCurrency(value)
      : formatValue(value);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-0">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="md:col-span-2 text-gray-900">{formattedValue}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'entreprise...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">Erreur</h2>
          <p className="text-gray-600 text-center mb-6">{error || 'Entreprise non trouvée'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                {company.logoUrl && (
                  <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{company.name || 'Entreprise'}</h1>
                  {company.shortTag && (
                    <p className="text-sm text-gray-600">{company.shortTag}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Informations générales */}
          <Section title="Informations générales" icon={Building2}>
            <div className="space-y-1">
              {company.id && <InfoRow label="ID" value={company.id} />}
              {company.name && <InfoRow label="Nom" value={company.name} />}
              {company.shortTag && <InfoRow label="Tag court" value={company.shortTag} />}
              {company.logoUrl && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2">
                  <div className="font-medium text-gray-700">Logo</div>
                  <div className="md:col-span-2">
                    <img src={company.logoUrl} alt={company.name} className="h-24 w-24 rounded-lg object-cover" />
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Données SIRENE */}
          {company.sireneData && (
            <Section title="Données SIRENE" icon={Shield}>
              <div className="space-y-1">
                {Object.entries(company.sireneData).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={value} />
                ))}
              </div>
            </Section>
          )}

          {/* Données ChatGPT / Analyse stratégique */}
          {company.chatGptData && (
            <>
              {/* Informations financières */}
              <Section title="Informations financières" icon={Euro}>
                <div className="space-y-1">
                  {company.chatGptData.annualRevenue !== undefined && (
                    <InfoRow label="Chiffre d'affaires annuel" value={company.chatGptData.annualRevenue} />
                  )}
                  {company.chatGptData.annualRevenueDisplay && (
                    <InfoRow label="CA (affiché)" value={company.chatGptData.annualRevenueDisplay} />
                  )}
                  {company.chatGptData.ebitdaValue !== undefined && (
                    <InfoRow label="EBITDA" value={company.chatGptData.ebitdaValue} />
                  )}
                  {company.chatGptData.debtValue !== undefined && (
                    <InfoRow label="Dette" value={company.chatGptData.debtValue} />
                  )}
                  {company.chatGptData.annualRevenue2024 !== undefined && (
                    <InfoRow label="CA 2024" value={company.chatGptData.annualRevenue2024} />
                  )}
                  {company.chatGptData.annualRevenue2023 !== undefined && (
                    <InfoRow label="CA 2023" value={company.chatGptData.annualRevenue2023} />
                  )}
                  {company.chatGptData.annualRevenue2022 !== undefined && (
                    <InfoRow label="CA 2022" value={company.chatGptData.annualRevenue2022} />
                  )}
                  {company.chatGptData.annualRevenue2021 !== undefined && (
                    <InfoRow label="CA 2021" value={company.chatGptData.annualRevenue2021} />
                  )}
                  {company.chatGptData.ebitdaValue2023 !== undefined && (
                    <InfoRow label="EBITDA 2023" value={company.chatGptData.ebitdaValue2023} />
                  )}
                  {company.chatGptData.debtValue2023 !== undefined && (
                    <InfoRow label="Dette 2023" value={company.chatGptData.debtValue2023} />
                  )}
                  {company.chatGptData.acquisitionProbability !== undefined && (
                    <InfoRow label="Probabilité d'acquisition" value={`${(company.chatGptData.acquisitionProbability * 100).toFixed(1)}%`} />
                  )}
                </div>
              </Section>

              {/* Informations sur l'entreprise */}
              <Section title="Informations sur l'entreprise" icon={Building2}>
                <div className="space-y-1">
                  {company.chatGptData.mainSector && <InfoRow label="Secteur principal" value={company.chatGptData.mainSector} />}
                  {company.chatGptData.subSector && <InfoRow label="Sous-secteur" value={company.chatGptData.subSector} />}
                  {company.chatGptData.city && <InfoRow label="Ville" value={company.chatGptData.city} />}
                  {company.chatGptData.department && <InfoRow label="Département" value={company.chatGptData.department} />}
                  {company.chatGptData.region && <InfoRow label="Région" value={company.chatGptData.region} />}
                  {company.chatGptData.employees !== undefined && <InfoRow label="Nombre d'employés" value={company.chatGptData.employees} />}
                  {company.chatGptData.employeeCount && <InfoRow label="Effectifs" value={company.chatGptData.employeeCount} />}
                  {company.chatGptData.seniorityYears !== undefined && <InfoRow label="Ancienneté (années)" value={company.chatGptData.seniorityYears} />}
                  {company.chatGptData.companyAgeYears !== undefined && <InfoRow label="Âge de l'entreprise (années)" value={company.chatGptData.companyAgeYears} />}
                  {company.chatGptData.description && <InfoRow label="Description" value={company.chatGptData.description} />}
                  {company.chatGptData.acquisitionPotential && <InfoRow label="Potentiel d'acquisition" value={company.chatGptData.acquisitionPotential} />}
                </div>
              </Section>

              {/* Opportunités et risques */}
              {(company.chatGptData.opportunities?.length || company.chatGptData.risks?.length) && (
                <Section title="Opportunités et risques" icon={TrendingUp}>
                  <div className="space-y-4">
                    {company.chatGptData.opportunities && company.chatGptData.opportunities.length > 0 && (
                      <div>
                        <h3 className="font-medium text-green-700 mb-2">Opportunités</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {company.chatGptData.opportunities.map((opp, idx) => (
                            <li key={idx}>{opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {company.chatGptData.risks && company.chatGptData.risks.length > 0 && (
                      <div>
                        <h3 className="font-medium text-red-700 mb-2">Risques</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {company.chatGptData.risks.map((risk, idx) => (
                            <li key={idx}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Signaux et indicateurs */}
              <Section title="Signaux et indicateurs" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.chatGptData.successionOrTransmissionSignals !== undefined && (
                    <InfoRow label="Signaux de succession/transmission" value={company.chatGptData.successionOrTransmissionSignals} />
                  )}
                  {company.chatGptData.carveOutPossible !== undefined && (
                    <InfoRow label="Carve-out possible" value={company.chatGptData.carveOutPossible} />
                  )}
                  {company.chatGptData.recentShareholderChanges !== undefined && (
                    <InfoRow label="Changements récents d'actionnaires" value={company.chatGptData.recentShareholderChanges} />
                  )}
                  {company.chatGptData.structuringRecruitment !== undefined && (
                    <InfoRow label="Recrutement structurant" value={company.chatGptData.structuringRecruitment} />
                  )}
                  {company.chatGptData.repositioningOrPivot !== undefined && (
                    <InfoRow label="Repositionnement/Pivot" value={company.chatGptData.repositioningOrPivot} />
                  )}
                  {company.chatGptData.isInCollectiveProcedure !== undefined && (
                    <InfoRow label="Procédure collective" value={company.chatGptData.isInCollectiveProcedure} />
                  )}
                </div>
              </Section>

              {/* Toutes les autres données */}
              <Section title="Toutes les données" icon={FileText}>
                <div className="space-y-1">
                  {Object.entries(company.chatGptData)
                    .filter(([key]) => 
                      !['annualRevenue', 'annualRevenueDisplay', 'ebitdaValue', 'debtValue', 
                        'annualRevenue2024', 'annualRevenue2023', 'annualRevenue2022', 'annualRevenue2021',
                        'ebitdaValue2023', 'debtValue2023', 'acquisitionProbability',
                        'mainSector', 'subSector', 'city', 'department', 'region', 'employees', 
                        'employeeCount', 'seniorityYears', 'companyAgeYears', 'description', 
                        'acquisitionPotential', 'opportunities', 'risks',
                        'successionOrTransmissionSignals', 'carveOutPossible', 'recentShareholderChanges',
                        'structuringRecruitment', 'repositioningOrPivot', 'isInCollectiveProcedure'].includes(key)
                    )
                    .map(([key, value]) => (
                      <InfoRow key={key} label={key} value={value} />
                    ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


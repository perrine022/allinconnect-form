// Enums
export enum UserType {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  MEGA_ADMIN = 'MEGA_ADMIN',
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum PlanCategory {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILY = 'FAMILY',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum PlanDuration {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export enum OfferType {
  OFFRE = 'OFFRE',
  EVENEMENT = 'EVENEMENT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

// Interface User complète (entité User)
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  birthDate?: string;
  userType: UserType;
  subscriptionType: SubscriptionType;
  subscriptionDate?: string;
  renewalDate?: string;
  subscriptionAmount?: number;
  profession?: string | null;
  category?: string | null;
  establishmentName?: string | null;
  establishmentDescription?: string | null;
  phoneNumber?: string;
  website?: string | null;
  instagram?: string | null;
  openingHours?: string | null;
  referralCode?: string;
  walletBalance?: number;
  hasConnectedBefore?: boolean;
}

// Interface pour l'inscription (UserRegistrationRequest)
export interface UserRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  birthDate?: string;
  userType: UserType;
  subscriptionType?: SubscriptionType;
  subscriptionPlanId?: number;
  profession?: string;
  category?: string;
  referralCode?: string;
  cardNumber?: string;
}

// Interface pour la mise à jour du profil
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  profession?: string;
  category?: string;
  establishmentName?: string;
  establishmentDescription?: string;
  website?: string;
  instagram?: string;
  openingHours?: string;
  [key: string]: any;
}

// Interface SubscriptionPlan (entité SubscriptionPlan)
export interface SubscriptionPlan {
  id: number;
  title: string;
  description: string;
  price: number;
  category: PlanCategory;
  duration: PlanDuration;
  referralReward: number;
}

// Interface Payment (entité Payment)
export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
}

// Interface Offer (entité Offer)
export interface Offer {
  id?: number;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  type: OfferType;
  status: OfferStatus;
  isFeatured: boolean;
}

// Enums pour Company
export enum Department {
  // Ajoutez les valeurs selon vos besoins
}

export enum Region {
  // Ajoutez les valeurs selon vos besoins
}

export enum ActivityType {
  // Ajoutez les valeurs selon vos besoins
}

export enum HardwareSoftware {
  // Ajoutez les valeurs selon vos besoins
}

export enum BusinessSegment {
  // Ajoutez les valeurs selon vos besoins
}

// Interface SireneData (Données Administratives SIRENE)
export interface SireneData {
  siren?: string;
  nic?: string;
  siret?: string;
  statutDiffusionEtablissement?: string;
  dateCreationEtablissement?: string;
  trancheEffectifsEtablissement?: string;
  anneeEffectifsEtablissement?: string;
  activitePrincipaleRegistreMetiersEtablissement?: string;
  dateDernierTraitementEtablissement?: string;
  etablissementSiege?: boolean;
  nombrePeriodesEtablissement?: number;
  activitePrincipaleNAF25Etablissement?: string;
  etatAdministratifUniteLegale?: string;
  statutDiffusionUniteLegale?: string;
  dateCreationUniteLegale?: string;
  categorieJuridiqueUniteLegale?: string;
  denominationUniteLegale?: string;
  sigleUniteLegale?: string;
  denominationUsuelle1UniteLegale?: string;
  activitePrincipaleUniteLegale?: string;
  nomenclatureActivitePrincipaleUniteLegale?: string;
  economieSocialeSolidaireUniteLegale?: string;
  trancheEffectifsUniteLegale?: string;
  anneeEffectifsUniteLegale?: string;
  nicSiegeUniteLegale?: string;
  dateDernierTraitementUniteLegale?: string;
  categorieEntreprise?: string;
  anneeCategorieEntreprise?: string;
  activitePrincipaleNAF25UniteLegale?: string;
  complementAdresseEtablissement?: string;
  numeroVoieEtablissement?: string;
  indiceRepetitionEtablissement?: string;
  typeVoieEtablissement?: string;
  libelleVoieEtablissement?: string;
  codePostalEtablissement?: string;
  libelleCommuneEtablissement?: string;
  codeCommuneEtablissement?: string;
  identifiantAdresseEtablissement?: string;
  coordonneeLambertAbscisseEtablissement?: string;
  coordonneeLambertOrdonneeEtablissement?: string;
  complementAdresse2Etablissement?: string;
  numeroVoie2Etablissement?: string;
  indiceRepetition2Etablissement?: string;
  typeVoie2Etablissement?: string;
  libelleVoie2Etablissement?: string;
  codePostal2Etablissement?: string;
  libelleCommune2Etablissement?: string;
  codeCommune2Etablissement?: string;
  codeCedex2Etablissement?: string;
  libelleCedex2Etablissement?: string;
  codePaysEtranger2Etablissement?: string;
  libellePaysEtranger2Etablissement?: string;
}

// Interface ChatGptData (Analyse Stratégique & IA)
export interface ChatGptData {
  mainSector?: string;
  city?: string;
  department?: Department | string;
  region?: Region | string;
  employees?: number;
  employeeCount?: string;
  seniorityYears?: number;
  annualRevenue?: number;
  annualRevenueDisplay?: string;
  ebitdaValue?: number;
  debtValue?: number;
  acquisitionProbability?: number;
  annualRevenueSourcesUrls?: string[];
  employeesSourcesUrls?: string[];
  description?: string;
  acquisitionPotential?: string;
  opportunities?: string[];
  risks?: string[];
  subSector?: string;
  activityType?: ActivityType | string;
  hardwareSoftware?: HardwareSoftware | string;
  industryServices?: string;
  techSoftwareRanking?: string;
  businessSegment?: BusinessSegment | string;
  geography?: string;
  ownership?: string;
  isInCollectiveProcedure?: boolean;
  leaderAge?: number;
  capitalConcentration?: string;
  founderType?: string;
  hasHolding?: boolean;
  revenueTrend?: string;
  ebitdaTrend?: string;
  debtLevel?: string;
  successionOrTransmissionSignals?: boolean;
  carveOutPossible?: boolean;
  recentShareholderChanges?: boolean;
  structuringRecruitment?: boolean;
  repositioningOrPivot?: boolean;
  groupStructure?: string;
  leaderGeneration?: string;
  disposalHistory?: string;
  shortTermDebtIncrease?: boolean;
  capexUpcoming?: boolean;
  recurringFilingIssues?: boolean;
  dependencySingleClient?: boolean;
  dependencySingleSupplier?: boolean;
  dependencyKeyPerson?: boolean;
  abnormalTurnover?: boolean;
  hiringFreezeOrLayoffs?: boolean;
  outsourcingCleanup?: boolean;
  litigationOrPrivileges?: boolean;
  frequentRestructuring?: boolean;
  pledgesOrSecurities?: boolean;
  activityDecreaseVisible?: boolean;
  brandPolishMarketing?: boolean;
  suddenPartnerships?: boolean;
  latestBusinessNews?: string[];
  contractsWon?: string[];
  linkedinNews?: string[];
  linkedinLeaderTransitionSignals?: boolean;
  sectorConsolidation?: boolean;
  regulationRequiresInvestments?: boolean;
  commodityEnergyPressure?: boolean;
  hasIntellectualProperty?: boolean;
  registeredTrademarks?: string[];
  patentsInnovations?: string[];
  specificExpertise?: string;
  extraKeywords?: string[];
  legalForm?: string;
  isInternational?: boolean;
  continent?: string;
  country?: string;
  pappersUrl?: string;
  annuaireDesEntreprisesUrl?: string;
  employeesMin?: number;
  employeesMax?: number;
  annualRevenueMin?: number;
  annualRevenueMax?: number;
  companyAgeYears?: number;
  companyAgeMin?: number;
  companyAgeMax?: number;
  sirenPappersUrl?: string;
  leaderName?: string;
  leaderBirthDate?: string;
  leaderTitle?: string;
  deputyLeaderName?: string;
  deputyLeaderAge?: number;
  deputyLeaderBirthDate?: string;
  recentShareholderChangesDetails?: string;
  frequentSellerGroup?: boolean;
  annualRevenue2024?: number;
  annualRevenue2023?: number;
  annualRevenue2022?: number;
  annualRevenue2021?: number;
  ebitdaValue2023?: number;
  ebitdaMarginMin?: number;
  ebitdaMarginMax?: number;
  debtValue2023?: number;
  restructuringProgramMentioned?: boolean;
  capexUpcomingDetails?: string;
  dependenciesDetails?: string;
  employeesTrend?: string;
  employees2023?: number;
  employees2021?: number;
  abnormalTurnoverRoles?: string;
  structuringRecruitmentRoles?: string;
  outsourcedFunctions?: string[];
  legalAlertsDetails?: string;
  headquartersTransfer?: boolean;
  partnershipsDetails?: string;
  successionKeywordsDetected?: string[];
  jobOffersTransitionSignals?: boolean;
  jobOffersKeywordsDetected?: string[];
  highResponsibilityJobOffers?: boolean;
  highResponsibilityJobTitles?: string[];
  websiteRecentlyUpdated?: boolean;
  careersPageEmpty?: boolean;
  techCycleShift?: boolean;
  marketContextDetails?: string;
}

// Interface CompanyDTO (Objet Racine)
export interface Company {
  id?: number;
  name?: string;
  logoUrl?: string;
  shortTag?: string;
  sireneData?: SireneData;
  chatGptData?: ChatGptData;
}


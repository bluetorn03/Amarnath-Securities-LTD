import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COMPANY_DETAILS } from '../data/mockData';

export interface CompanyProfile {
  // Identity
  name: string;
  company_name: string;
  shortName: string;
  short_name: string;
  tagline: string;
  trustLine: string;
  trust_line: string;
  corePositioning: string;
  core_positioning: string;
  cin: string;
  bseScripCode: string;
  bse_scrip_code: string;
  isin: string;
  foundedYear: string;
  founded_year: string;

  // Direct Contact
  email: string;
  phone: string;
  website?: string;

  // Physical Coordinates
  regOffice: string;
  reg_office: string;
  corpOffice: string;
  corp_office: string;

  // Compliance Officer
  complianceOfficer: string;
  compliance_officer: string;
  complianceDesignation: string;
  compliance_designation: string;
  complianceEmail: string;
  compliance_email: string;
  compliancePhone: string;
  compliance_phone: string;

  // Registrar and Transfer Agent (RTA)
  rtaName: string;
  rta_name: string;
  rtaHistoricalLiaison: string;
  rta_historical_liaison: string;
  rtaAddress: string;
  rta_address: string;
  rtaEmail: string;
  rta_email: string;
  rtaPhone: string;
  rta_phone: string;
  rtaWebsite: string;
  rta_website: string;

  // Regulatory Portals
  sebiScoresUrl: string;
  sebi_scores_url: string;
  sebiSmartOdrUrl: string;
  sebi_smart_odr_url: string;
  bsePortalUrl: string;
  bse_portal_url: string;

  // Metadata
  updated_at?: string;
}

// Fallback initial state matching static default
const initialProfile: CompanyProfile = {
  name: COMPANY_DETAILS.name,
  company_name: COMPANY_DETAILS.name,
  shortName: COMPANY_DETAILS.shortName,
  short_name: COMPANY_DETAILS.shortName,
  tagline: COMPANY_DETAILS.tagline,
  trustLine: COMPANY_DETAILS.trustLine,
  trust_line: COMPANY_DETAILS.trustLine,
  corePositioning: COMPANY_DETAILS.corePositioning,
  core_positioning: COMPANY_DETAILS.corePositioning,
  cin: COMPANY_DETAILS.cin,
  bseScripCode: COMPANY_DETAILS.bseScripCode,
  bse_scrip_code: COMPANY_DETAILS.bseScripCode,
  isin: COMPANY_DETAILS.isin,
  foundedYear: COMPANY_DETAILS.foundedYear,
  founded_year: COMPANY_DETAILS.foundedYear,
  email: COMPANY_DETAILS.email,
  phone: COMPANY_DETAILS.phone,
  website: 'https://www.amarnathsecuritiesltd.com',
  regOffice: COMPANY_DETAILS.regOffice,
  reg_office: COMPANY_DETAILS.regOffice,
  corpOffice: COMPANY_DETAILS.corpOffice,
  corp_office: COMPANY_DETAILS.corpOffice,
  complianceOfficer: COMPANY_DETAILS.complianceOfficer,
  compliance_officer: COMPANY_DETAILS.complianceOfficer,
  complianceDesignation: COMPANY_DETAILS.complianceDesignation,
  compliance_designation: COMPANY_DETAILS.complianceDesignation,
  complianceEmail: COMPANY_DETAILS.complianceEmail,
  compliance_email: COMPANY_DETAILS.complianceEmail,
  compliancePhone: COMPANY_DETAILS.compliancePhone,
  compliance_phone: COMPANY_DETAILS.compliancePhone,
  rtaName: COMPANY_DETAILS.rtaName,
  rta_name: COMPANY_DETAILS.rtaName,
  rtaHistoricalLiaison: COMPANY_DETAILS.rtaHistoricalLiaison,
  rta_historical_liaison: COMPANY_DETAILS.rtaHistoricalLiaison,
  rtaAddress: COMPANY_DETAILS.rtaAddress,
  rta_address: COMPANY_DETAILS.rtaAddress,
  rtaEmail: COMPANY_DETAILS.rtaEmail,
  rta_email: COMPANY_DETAILS.rtaEmail,
  rtaPhone: COMPANY_DETAILS.rtaPhone,
  rta_phone: COMPANY_DETAILS.rtaPhone,
  rtaWebsite: COMPANY_DETAILS.rtaWebsite,
  rta_website: COMPANY_DETAILS.rtaWebsite,
  sebiScoresUrl: COMPANY_DETAILS.sebiScoresUrl,
  sebi_scores_url: COMPANY_DETAILS.sebiScoresUrl,
  sebiSmartOdrUrl: COMPANY_DETAILS.sebiSmartOdrUrl,
  sebi_smart_odr_url: COMPANY_DETAILS.sebiSmartOdrUrl,
  bsePortalUrl: COMPANY_DETAILS.bsePortalUrl,
  bse_portal_url: COMPANY_DETAILS.bsePortalUrl
};

interface CompanyProfileContextType {
  profile: CompanyProfile;
  loading: boolean;
  reloadProfile: () => Promise<void>;
}

const CompanyProfileContext = createContext<CompanyProfileContextType>({
  profile: initialProfile,
  loading: false,
  reloadProfile: async () => {}
});

export const CompanyProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/profile');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        setProfile((prev) => ({
          ...prev,
          ...json.data
        }));
      }
    } catch {
      // Graceful fallback to initial values if network/API is unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    // Listen for custom event triggered when admin saves settings
    const handleUpdateEvent = () => {
      fetchProfile();
    };

    window.addEventListener('company_profile_updated', handleUpdateEvent);
    return () => {
      window.removeEventListener('company_profile_updated', handleUpdateEvent);
    };
  }, [fetchProfile]);

  return (
    <CompanyProfileContext.Provider value={{ profile, loading, reloadProfile: fetchProfile }}>
      {children}
    </CompanyProfileContext.Provider>
  );
};

export function useCompanyProfile() {
  return useContext(CompanyProfileContext);
}

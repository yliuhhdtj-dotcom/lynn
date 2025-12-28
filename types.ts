
export interface ArchitectureInfo {
  locationName: string;
  country: string;
  city: string;
  designer: string;
  constructionYear: string;
  area: string;
  function: string;
  designPhilosophy: string;
  background: string;
  interestingFacts: string[];
}

export interface AppState {
  image: string | null;
  loading: boolean;
  error: string | null;
  result: ArchitectureInfo | null;
}

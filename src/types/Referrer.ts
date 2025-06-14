export type Referrer = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  raw_url?: string;
};

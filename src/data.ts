import data from './vendors.json'
export type Vendor = {
  name: string; category: 'flipper' | 'plate' | 'other'; region: string; fit: number;
  message: string; whatsapp?: string; link?: string; linkLabel?: string; moq?: string;
  contact?: string; verified?: boolean; email?: string; emailSubject?: string; emailBody?: string
}
export const vendors = data as Vendor[]

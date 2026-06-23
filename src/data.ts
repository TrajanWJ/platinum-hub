import data from './vendors.json'
export type Vendor = {
  name: string; category: 'flipper' | 'plate'; region: string; fit: number;
  message: string; whatsapp?: string; link?: string; linkLabel?: string; moq?: string;
  contact?: string; verified?: boolean
}
export const vendors = data as Vendor[]

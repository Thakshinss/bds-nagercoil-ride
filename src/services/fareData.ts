export interface FareData {
  id: string;
  from: string;
  to: string;
  vehicleType: string;
  price: string;
}

const STORAGE_KEY = 'bds-fare-data';

const defaultFareData: FareData[] = [
  { id: '1', from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'Sedan', price: '₹1,200' },
  { id: '2', from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'SUV', price: '₹1,500' },
  { id: '3', from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'Hatchback', price: '₹1,000' },
  { id: '4', from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'Sedan', price: '₹800' },
  { id: '5', from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'SUV', price: '₹1,000' },
  { id: '6', from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'Hatchback', price: '₹600' },
  { id: '7', from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'Sedan', price: '₹1,500' },
  { id: '8', from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'SUV', price: '₹1,800' },
  { id: '9', from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'Hatchback', price: '₹1,200' },
  { id: '10', from: 'Nagercoil', to: 'Madurai', vehicleType: 'Sedan', price: '₹3,500' },
  { id: '11', from: 'Nagercoil', to: 'Madurai', vehicleType: 'SUV', price: '₹4,000' },
  { id: '12', from: 'Nagercoil', to: 'Madurai', vehicleType: 'Hatchback', price: '₹3,000' },
  { id: '13', from: 'Nagercoil', to: 'Chennai', vehicleType: 'Sedan', price: '₹8,000' },
  { id: '14', from: 'Nagercoil', to: 'Chennai', vehicleType: 'SUV', price: '₹9,500' },
  { id: '15', from: 'Nagercoil', to: 'Chennai', vehicleType: 'Hatchback', price: '₹7,000' },
];

export const fareDataService = {
  getAllFares(): FareData[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data if none exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFareData));
    return defaultFareData;
  },

  addFare(fare: Omit<FareData, 'id'>): FareData {
    const fares = this.getAllFares();
    const newFare: FareData = {
      ...fare,
      id: Date.now().toString(),
    };
    fares.push(newFare);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fares));
    return newFare;
  },

  updateFare(id: string, updatedFare: Omit<FareData, 'id'>): boolean {
    const fares = this.getAllFares();
    const index = fares.findIndex(fare => fare.id === id);
    if (index !== -1) {
      fares[index] = { ...updatedFare, id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fares));
      return true;
    }
    return false;
  },

  deleteFare(id: string): boolean {
    const fares = this.getAllFares();
    const filteredFares = fares.filter(fare => fare.id !== id);
    if (filteredFares.length !== fares.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFares));
      return true;
    }
    return false;
  },

  getFareById(id: string): FareData | undefined {
    const fares = this.getAllFares();
    return fares.find(fare => fare.id === id);
  }
};
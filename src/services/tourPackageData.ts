export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  destinations: string;
  price: string;
  image: string;
  highlights: string[];
  inclusions: string[];
}

const STORAGE_KEY = 'bds-tour-packages';

const defaultTourPackages: TourPackage[] = [
  {
    id: '1',
    title: 'Kanyakumari Spiritual Tour',
    description: 'Experience the spiritual essence of Kanyakumari with visits to famous temples and sunset points.',
    duration: '2 Days / 1 Night',
    destinations: 'Kanyakumari, Vivekananda Rock, Thiruvalluvar Statue',
    price: '₹4,500',
    image: '/api/placeholder/400/300',
    highlights: ['Sunrise & Sunset View', 'Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Kanyakumari Temple'],
    inclusions: ['Transportation', 'Accommodation', 'Breakfast', 'Guide Service']
  },
  {
    id: '2',
    title: 'Nagercoil Heritage Tour',
    description: 'Explore the rich cultural heritage and historical landmarks of Nagercoil.',
    duration: '1 Day',
    destinations: 'Nagercoil, Nagaraja Temple, Padmanabhapuram Palace',
    price: '₹2,800',
    image: '/api/placeholder/400/300',
    highlights: ['Nagaraja Temple', 'Padmanabhapuram Palace', 'Local Markets', 'Traditional Cuisine'],
    inclusions: ['Transportation', 'Lunch', 'Entry Fees', 'Guide Service']
  },
  {
    id: '3',
    title: 'Western Ghats Adventure',
    description: 'Adventure tour through the scenic Western Ghats with trekking and nature exploration.',
    duration: '3 Days / 2 Nights',
    destinations: 'Agasthyarkoodam, Peppara Wildlife Sanctuary, Ponmudi',
    price: '₹8,500',
    image: '/api/placeholder/400/300',
    highlights: ['Trekking', 'Wildlife Safari', 'Mountain Views', 'Tea Plantations'],
    inclusions: ['Transportation', 'Accommodation', 'All Meals', 'Trekking Guide', 'Equipment']
  },
  {
    id: '4',
    title: 'Trivandrum City Tour',
    description: 'Comprehensive city tour covering major attractions and cultural sites in Trivandrum.',
    duration: '1 Day',
    destinations: 'Padmanabhaswamy Temple, Napier Museum, Kovalam Beach',
    price: '₹3,200',
    image: '/api/placeholder/400/300',
    highlights: ['Padmanabhaswamy Temple', 'Napier Museum', 'Kovalam Beach', 'Shopping'],
    inclusions: ['Transportation', 'Lunch', 'Entry Fees', 'Guide Service']
  }
];

export const tourPackageService = {
  getAllPackages(): TourPackage[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data if none exists
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTourPackages));
    return defaultTourPackages;
  },

  addPackage(pkg: Omit<TourPackage, 'id'>): TourPackage {
    const packages = this.getAllPackages();
    const newPackage: TourPackage = {
      ...pkg,
      id: Date.now().toString(),
    };
    packages.push(newPackage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    return newPackage;
  },

  updatePackage(id: string, updatedPackage: Omit<TourPackage, 'id'>): boolean {
    const packages = this.getAllPackages();
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index !== -1) {
      packages[index] = { ...updatedPackage, id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
      return true;
    }
    return false;
  },

  deletePackage(id: string): boolean {
    const packages = this.getAllPackages();
    const filteredPackages = packages.filter(pkg => pkg.id !== id);
    if (filteredPackages.length !== packages.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPackages));
      return true;
    }
    return false;
  },

  getPackageById(id: string): TourPackage | undefined {
    const packages = this.getAllPackages();
    return packages.find(pkg => pkg.id === id);
  }
};
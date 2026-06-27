export interface HomeAttributes {
  welcomeMessage?: string;
  featuredProducts?: any[];
  categories?: any[];
  stats?: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
  };
  features?: {
    title: string;
    description: string;
  }[];
}

export interface HomeCreationAttrs {
  welcomeMessage?: string;
  featuredProducts?: any[];
  categories?: any[];
  stats?: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
  };
  features?: {
    title: string;
    description: string;
  }[];
}

export class Home {
  public welcomeMessage?: string;
  public featuredProducts?: any[];
  public categories?: any[];
  public stats?: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
  };
  public features?: {
    title: string;
    description: string;
  }[];

  constructor(data: HomeCreationAttrs) {
    Object.assign(this, data);
  }
}

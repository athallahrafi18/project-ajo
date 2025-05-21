export interface CategoryAttribute {
    id: string;
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
    required: boolean;
  }
  
  export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    attributes: CategoryAttribute[];
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
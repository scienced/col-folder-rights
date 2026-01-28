// Channel types for file usage
export type UsageChannel =
  | 'in-store'
  | 'print'
  | 'website'
  | 'marketplaces'
  | 'ecommerce'
  | 'social'
  | 'newsletter';

// File types for badges
export type FileType = 'CSV' | 'PNG' | 'PDF' | 'JPG' | 'DOCX' | 'XLS';

// Access rule criteria types
export type RuleCriteria = 'user_collection_access' | 'user_role';

// Access rule operators
export type RuleOperator = 'is_any_of' | 'is_none_of';

// Access rule definition
export interface AccessRule {
  id: string;
  criteria: RuleCriteria;
  operator: RuleOperator;
  values: string[];
}

// File entity
export interface FileItem {
  id: string;
  folderId: string;
  name: string;
  description: string;
  type: FileType;
  uploadedAt: string;
  size: string;
  resolution?: string;
  thumbnailUrl: string;
  channels: UsageChannel[];
  availabilityStart?: string;
  availabilityEnd?: string;
  accessRules: AccessRule[];
}

// Folder entity
export interface Folder {
  id: string;
  name: string;
  thumbnailUrl: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  accessRules: AccessRule[];
}

// User collection (for access rules)
export interface UserCollection {
  id: string;
  name: string;
}

// User role (for access rules)
export interface UserRole {
  id: string;
  name: string;
}

// Breadcrumb item
export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

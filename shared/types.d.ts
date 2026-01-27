// export interface User {
//     _id?: string;
//     tenantId: string;
//     employeeId: string;
//     email: string;
//     password?: string;
//     role: 'super_admin' | 'admin' | 'hr_manager' | 'finance_manager' | 'manager' | 'employee';
//     firstName: string;
//     lastName: string;
//     department: string;
//     managerId?: string;
//     isActive: boolean;
//     lastLogin?: Date;
//     createdAt: Date;
//     updatedAt: Date;
// }
// export interface Employee {
//     _id?: string;
//     tenantId: string;
//     employeeId: string;
//     personalInfo: {
//         firstName: string;
//         lastName: string;
//         email: string;
//         phone: string;
//         dateOfBirth: Date;
//         address: string;
//     };
//     workInfo: {
//         department: string;
//         position: string;
//         managerId?: string;
//         hireDate: Date;
//         employmentType: 'full-time' | 'part-time' | 'contract';
//         salary: number;
//         workLocation: string;
//     };
//     status: 'active' | 'inactive' | 'onboarding' | 'terminated';
//     createdAt: Date;
//     updatedAt: Date;
// }
// export interface LoginRequest {
//     email: string;
//     password: string;
// }
// export interface LoginResponse {
//     token: string;
//     user: Omit<User, 'password'>;
// }
// export interface ApiResponse<T = any> {
//     success: boolean;
//     data?: T;
//     message?: string;
//     error?: string;
// }
// export interface Role {
//     _id?: string;
//     name: string;
//     displayName: string;
//     description?: string;
//     permissions: string[];
//     isActive: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
// }
// export interface Permission {
//     _id?: string;
//     name: string;
//     displayName: string;
//     module: string;
//     action: string;
//     description?: string;
//     isActive: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
// }
// export interface NavigationItem {
//     _id?: string;
//     id: string;
//     label: string;
//     icon?: string;
//     path?: string;
//     parentId?: string;
//     order: number;
//     requiredPermissions: string[];
//     children?: NavigationItem[];
//     isActive: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
// }
// export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'finance_manager' | 'manager' | 'employee';
// export interface RolePermissions {
//     [key: string]: string[];
// }
// //# sourceMappingURL=types.d.ts.map
# HRMS Fullstack Application - AI Coding Guidelines

## Architecture Overview
This is a comprehensive Human Resource Management System with multi-tenant support:
- **Frontend**: React 18 + TypeScript + Vite + Shadcn/ui + Tailwind CSS + TanStack React Query
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose
- **Authentication**: JWT-based with role-based access control (RBAC)
- **Multi-tenancy**: Tenant-scoped data with `tenantId` field in all models
- **Deployment**: Docker containerized with docker-compose

## Core Patterns & Conventions

### API Response Format
All backend endpoints return responses in this exact format:
```typescript
{
  success: boolean;
  data?: any;
  message?: string;
}
```
**Example**: Never return data directly - always wrap in `{success: true, data: result}`

### Role-Based Access Control
Six user roles with specific permissions:
- **super_admin**: Full access across all tenants
- **admin**: Administrative access within tenant
- **hr_manager**: HR operations, employee management
- **finance_manager**: Payroll and financial operations
- **manager**: Team management and approvals
- **employee**: Personal data access only

**Implementation**: Routes use middleware chain:
```typescript
router.get('/', authenticateToken, authorizeRoles('super_admin', 'hr_manager'), async (req, res) => {
  // Business logic
});
```

### Database Models
All models include:
- `tenantId: string` for multi-tenancy (indexed)
- `status: 'active' | 'inactive' | 'onboarding' | 'terminated'` for lifecycle management
- `createdAt` and `updatedAt` timestamps
- Proper Mongoose validation and indexing

### Shared Type Definitions
TypeScript interfaces shared between frontend/backend in `shared/types.ts`:
- Maintain consistency between client and server type definitions
- Use these types for API contracts and data validation

### Frontend Data Fetching
Uses TanStack React Query with axios interceptors:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['endpoint'],
  queryFn: () => api.get('/api/endpoint').then(res => res.data.data)
});
```

## Critical Developer Workflows

### Local Development Setup
```bash
# Backend setup
cd backend && npm install
npm run seed          # Populate database with initial data
npm run seed:dashboard # Populate dashboard metrics
npm run dev           # Start with nodemon (auto-restart)

# Frontend setup
cd frontend && npm install
npm run dev           # Start Vite dev server

# Full stack with Docker
docker-compose up --build
```

### Database Seeding
**Always run after backend setup**: `npm run seed` creates essential data (departments, roles, users, permissions)
**Dashboard data**: `npm run seed:dashboard` populates analytics widgets

### Testing APIs
Use the test script: `./test-api.sh` - validates all endpoints with authentication (requires jq)

## Key Files & Directories

### Backend Structure
- `src/controllers/` - Business logic with RBAC checks
- `src/models/` - Mongoose schemas with tenantId and status fields
- `src/routes/` - Express routes with auth middleware
- `src/scripts/seedComplete.ts` - Database seeding logic
- `src/middleware/auth.ts` - JWT authentication and role authorization

### Frontend Structure
- `src/services/api.ts` - Axios client with JWT interceptors
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/components/ui/` - Shadcn/ui reusable components
- `src/pages/` - Route-based page components
- `src/hooks/` - Custom React hooks

### Shared Resources
- `shared/types.ts` - TypeScript interfaces for API contracts
- `docker-compose.yml` - Multi-service container orchestration

## Common Implementation Patterns

### Controller Pattern
```typescript
export const getData = async (req: Request, res: Response) => {
  try {
    // 1. Role verification via middleware
    // 2. Tenant-scoped queries
    const data = await Model.find({
      tenantId: req.user.tenantId,
      status: 'active'
    });

    // 3. Consistent response format
    res.json({success: true, data: data});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server error'});
  }
};
```

### Frontend Component Pattern
```typescript
const Component = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: () => apiService.getData()
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Role-based rendering */}
      {['super_admin', 'hr_manager'].includes(user.role) && <AdminControls />}
      <DataDisplay data={data?.data} />
    </div>
  );
};
```

## Environment & Deployment

### Required Environment Variables
```bash
# Backend
MONGODB_URI=mongodb://localhost:27017/HRMS
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Docker Services
- `mongodb`: Database (port 27017)
- `backend`: API server (port 5000)
- `frontend`: React app (port 5173)

## Security Considerations
- All endpoints require JWT authentication except `/api/auth/login`
- Passwords hashed with bcryptjs
- Rate limiting enabled (100 requests per 15 minutes)
- CORS configured for localhost development
- Helmet.js security headers
- Multi-tenant data isolation via tenantId

## Debugging Tips
- Check browser Network tab for API calls - all should return `{success: true, data: ...}`
- Backend logs show authentication status and role verification
- Dashboard errors often indicate missing seeded data - run `npm run seed:dashboard`
- Use test script `./test-api.sh` to verify backend functionality
- MongoDB queries must include tenantId for data isolation

## Code Quality Standards
- TypeScript strict mode enabled
- ESLint configuration for consistent code style
- Prettier for code formatting
- All models include proper validation and indexing
- API documentation maintained in `API_DOCUMENTATION.md`
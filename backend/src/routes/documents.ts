import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getExpiringDocuments
} from '../controllers/documentController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all documents
router.get('/', getDocuments);

// Get single document
router.get('/:id', getDocumentById);

// Create document
router.post('/', createDocument);

// Update document
router.put('/:id', updateDocument);

// Delete document
router.delete('/:id', deleteDocument);

// Get expiring documents
router.get('/expiring/soon', getExpiringDocuments);

export default router;
import { Request, Response } from 'express';
import { HRDocument } from '../models/Document';

interface AuthRequest extends Request {
  user?: any;
}

// Get all documents for the tenant
export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, documentType, status } = req.query;
    const filter: any = { tenantId: req.user!.tenantId };

    if (employeeId) filter.employeeId = employeeId;
    if (documentType) filter.documentType = documentType;
    if (status) filter.status = status;

    const documents = await HRDocument.find(filter)
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName')
      .sort({ uploadedDate: -1 });

    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
};

// Get single document
export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const document = await HRDocument.findOne({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    }).populate('employeeId', 'personalInfo.firstName personalInfo.lastName');

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch document' });
  }
};

// Create document
export const createDocument = async (req: AuthRequest, res: Response) => {
  try {
    const documentData = {
      ...req.body,
      tenantId: req.user!.tenantId,
      uploadedBy: req.user!._id
    };

    const document = new HRDocument(documentData);
    await document.save();

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(400).json({ success: false, message: 'Failed to create document'});
  }
};

// Update document
export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const document = await HRDocument.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      req.body,
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update document' });
  }
};

// Delete document
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const document = await HRDocument.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user!.tenantId
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};

// Get documents expiring soon
export const getExpiringDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await HRDocument.find({
      tenantId: req.user!.tenantId,
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
      status: 'active'
    }).populate('employeeId', 'personalInfo.firstName personalInfo.lastName');

    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch expiring documents' });
  }
};
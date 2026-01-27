import mongoose, { Schema, Document } from 'mongoose';

export interface NavigationItemDocument extends Document {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order: number;
  requiredPermissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const navigationItemSchema = new Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String },
  path: { type: String },
  parentId: { type: String },
  order: { type: Number, default: 0 },
  requiredPermissions: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

navigationItemSchema.index({ parentId: 1, order: 1 });

export const NavigationItem = mongoose.model<NavigationItemDocument>('NavigationItem', navigationItemSchema);
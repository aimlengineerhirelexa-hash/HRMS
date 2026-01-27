import mongoose, { Schema, Document } from 'mongoose';

export interface RoleDocument extends Document {
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Role = mongoose.model<RoleDocument>('Role', roleSchema);
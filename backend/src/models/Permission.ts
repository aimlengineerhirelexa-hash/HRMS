import mongoose, { Schema, Document } from 'mongoose';

export interface PermissionDocument extends Document {
  name: string;
  displayName: string;
  module: string;
  action: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

permissionSchema.index({ module: 1, action: 1 });

export const Permission = mongoose.model<PermissionDocument>('Permission', permissionSchema);
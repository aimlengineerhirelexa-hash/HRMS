import mongoose, { Schema, Document } from 'mongoose';

export interface IHoliday extends Document {
  tenantId: string;
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'optional';
  locations: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HolidaySchema: Schema = new Schema({
  tenantId: { type: String, required: true, default: 'default' },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['national', 'regional', 'optional'], required: true },
  locations: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Holiday = mongoose.model<IHoliday>('Holiday', HolidaySchema);
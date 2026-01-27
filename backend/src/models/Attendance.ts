import mongoose, { Schema, Document } from 'mongoose';

export interface AttendanceDocument extends Document {
  tenantId: string;
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  breakTime?: number;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<AttendanceDocument>({
  tenantId: { type: String, required: true, index: true },
  employeeId: { type: String, required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  breakTime: { type: Number, default: 0 },
  totalHours: { type: Number },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half-day'],
    required: true 
  },
  notes: { type: String }
}, {
  timestamps: true
});

attendanceSchema.index({ tenantId: 1, employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<AttendanceDocument>('Attendance', attendanceSchema);
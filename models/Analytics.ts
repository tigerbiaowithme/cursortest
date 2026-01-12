import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  date: Date;
  page: string;
  ipAddress: string;
  country: string;
  city?: string;
  userAgent?: string;
  referrer?: string;
  language: string;
}

const AnalyticsSchema: Schema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  page: { type: String, required: true },
  ipAddress: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  language: { type: String, default: 'en' },
});

// 创建索引以提高查询性能
AnalyticsSchema.index({ date: 1 });
AnalyticsSchema.index({ page: 1 });
AnalyticsSchema.index({ country: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

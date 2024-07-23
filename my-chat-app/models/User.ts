import mongoose from "mongoose";

// 사용자 스키마 정의
const UserSchema = new mongoose.Schema({
  // 사용자 이름
  username: { type: String, required: true, unique: true },
});

// 사용자 모델 생성 또는 기존 모델 사용
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
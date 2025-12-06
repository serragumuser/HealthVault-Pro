-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'NURSE', 'ADMIN', 'PHARMACIST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "DoctorSpecialty" AS ENUM ('GENERAL_PRACTITIONER', 'CARDIOLOGIST', 'DERMATOLOGIST', 'ENDOCRINOLOGIST', 'GASTROENTEROLOGIST', 'NEUROLOGIST', 'ONCOLOGIST', 'PEDIATRICIAN', 'PSYCHIATRIST', 'RADIOLOGIST', 'SURGEON', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LabTestCategory" AS ENUM ('BLOOD_TEST', 'URINE_TEST', 'IMAGING', 'BIOPSY', 'GENETIC_TEST', 'MICROBIOLOGY', 'OTHER');

-- CreateEnum
CREATE TYPE "LabResultStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'LAB_RESULT_AVAILABLE', 'PRESCRIPTION_EXPIRING', 'MESSAGE_RECEIVED', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'PROFILE_UPDATE', 'PASSWORD_CHANGE', 'APPOINTMENT_CREATED', 'APPOINTMENT_CANCELLED', 'PRESCRIPTION_VIEWED', 'LAB_RESULT_VIEWED', 'MEDICAL_RECORD_ACCESSED', 'EMERGENCY_PROFILE_ACCESSED');

-- CreateEnum
CREATE TYPE "AIInteractionType" AS ENUM ('CHATBOT_QUERY', 'LAB_RESULT_ANALYSIS', 'HEALTH_RISK_ASSESSMENT', 'MEDICATION_INTERACTION_CHECK', 'SYMPTOM_ANALYSIS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "profileImageUrl" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodType" "BloodType" NOT NULL DEFAULT 'UNKNOWN',
    "gender" "Gender" NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Poland',
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "insuranceProvider" TEXT,
    "insuranceNumber" TEXT,
    "allergies" TEXT[],
    "chronicConditions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "specialty" "DoctorSpecialty" NOT NULL,
    "subSpecialty" TEXT,
    "experience" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "hospitalAffiliation" TEXT,
    "consultationFee" DOUBLE PRECISION,
    "availableForTelemedicine" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "officeAddress" TEXT,
    "officePhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_availability" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "doctor_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "videoRoomId" TEXT,
    "prescriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "recordType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diagnosis" TEXT,
    "symptoms" TEXT[],
    "treatment" TEXT,
    "attachments" TEXT[],
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "sideEffects" TEXT[],
    "interactions" TEXT[],
    "dosageForm" TEXT NOT NULL,
    "strength" TEXT[],
    "manufacturer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription_medications" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "quantity" INTEGER NOT NULL,
    "refills" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prescription_medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_medications" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderTimes" TEXT[],
    "adherenceRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "category" "LabTestCategory" NOT NULL,
    "testName" TEXT NOT NULL,
    "status" "LabResultStatus" NOT NULL DEFAULT 'PENDING',
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionDate" TIMESTAMP(3),
    "resultDate" TIMESTAMP(3),
    "reviewedDate" TIMESTAMP(3),
    "laboratoryName" TEXT,
    "referenceNumber" TEXT,
    "results" JSONB NOT NULL,
    "interpretation" TEXT,
    "abnormalFlags" TEXT[],
    "doctorNotes" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "heartRate" INTEGER,
    "temperature" DOUBLE PRECISION,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "glucoseLevel" DOUBLE PRECISION,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodType" "BloodType" NOT NULL,
    "allergies" TEXT[],
    "chronicConditions" TEXT[],
    "currentMedications" TEXT[],
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "emergencyContactRelation" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "qrCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AIInteractionType" NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "modelVersion" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE INDEX "patients_userId_idx" ON "patients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_licenseNumber_key" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE INDEX "doctors_userId_idx" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "doctors_licenseNumber_idx" ON "doctors"("licenseNumber");

-- CreateIndex
CREATE INDEX "doctors_specialty_idx" ON "doctors"("specialty");

-- CreateIndex
CREATE INDEX "doctor_availability_doctorId_dayOfWeek_idx" ON "doctor_availability"("doctorId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_prescriptionId_key" ON "appointments"("prescriptionId");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");

-- CreateIndex
CREATE INDEX "appointments_scheduledAt_idx" ON "appointments"("scheduledAt");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "medical_records_patientId_idx" ON "medical_records"("patientId");

-- CreateIndex
CREATE INDEX "medical_records_doctorId_idx" ON "medical_records"("doctorId");

-- CreateIndex
CREATE INDEX "medical_records_recordDate_idx" ON "medical_records"("recordDate");

-- CreateIndex
CREATE INDEX "prescriptions_patientId_idx" ON "prescriptions"("patientId");

-- CreateIndex
CREATE INDEX "prescriptions_doctorId_idx" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE INDEX "prescriptions_status_idx" ON "prescriptions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "medications_name_key" ON "medications"("name");

-- CreateIndex
CREATE INDEX "medications_name_idx" ON "medications"("name");

-- CreateIndex
CREATE INDEX "prescription_medications_prescriptionId_idx" ON "prescription_medications"("prescriptionId");

-- CreateIndex
CREATE INDEX "prescription_medications_medicationId_idx" ON "prescription_medications"("medicationId");

-- CreateIndex
CREATE INDEX "patient_medications_patientId_idx" ON "patient_medications"("patientId");

-- CreateIndex
CREATE INDEX "patient_medications_medicationId_idx" ON "patient_medications"("medicationId");

-- CreateIndex
CREATE INDEX "patient_medications_isActive_idx" ON "patient_medications"("isActive");

-- CreateIndex
CREATE INDEX "lab_results_patientId_idx" ON "lab_results"("patientId");

-- CreateIndex
CREATE INDEX "lab_results_status_idx" ON "lab_results"("status");

-- CreateIndex
CREATE INDEX "lab_results_orderDate_idx" ON "lab_results"("orderDate");

-- CreateIndex
CREATE INDEX "vital_signs_patientId_idx" ON "vital_signs"("patientId");

-- CreateIndex
CREATE INDEX "vital_signs_recordedAt_idx" ON "vital_signs"("recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_profiles_userId_key" ON "emergency_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_profiles_qrCode_key" ON "emergency_profiles"("qrCode");

-- CreateIndex
CREATE INDEX "emergency_profiles_userId_idx" ON "emergency_profiles"("userId");

-- CreateIndex
CREATE INDEX "emergency_profiles_qrCode_idx" ON "emergency_profiles"("qrCode");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_type_idx" ON "activity_logs"("type");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "ai_interactions_userId_idx" ON "ai_interactions"("userId");

-- CreateIndex
CREATE INDEX "ai_interactions_type_idx" ON "ai_interactions"("type");

-- CreateIndex
CREATE INDEX "ai_interactions_createdAt_idx" ON "ai_interactions"("createdAt");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_availability" ADD CONSTRAINT "doctor_availability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_medications" ADD CONSTRAINT "prescription_medications_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription_medications" ADD CONSTRAINT "prescription_medications_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_medications" ADD CONSTRAINT "patient_medications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_medications" ADD CONSTRAINT "patient_medications_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_profiles" ADD CONSTRAINT "emergency_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

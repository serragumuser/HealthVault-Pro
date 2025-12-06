import { PrismaClient, UserRole, UserStatus, BloodType, Gender, DoctorSpecialty, AppointmentType, AppointmentStatus, PrescriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const password = await bcrypt.hash('Test123456!', 12);

    // Create test patient user
    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@healthvault.com' },
        update: {},
        create: {
            email: 'patient@healthvault.com',
            password,
            firstName: 'John',
            lastName: 'Doe',
            role: UserRole.PATIENT,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            phoneNumber: '+11234567890',
            dateOfBirth: new Date('1990-01-15'),
        },
    });

    console.log('Created patient user:', patientUser.email);

    // Create patient profile
    const patient = await prisma.patient.upsert({
        where: { userId: patientUser.id },
        update: {},
        create: {
            userId: patientUser.id,
            bloodType: BloodType.O_POSITIVE,
            gender: Gender.MALE,
            allergies: ['Penicillin', 'Peanuts'],
            chronicConditions: ['Hypertension'],
            emergencyContactName: 'Jane Doe',
            emergencyContactPhone: '+11234567891',
            insuranceProvider: 'Blue Cross',
            insuranceNumber: 'BC123456',
        },
    });

    console.log('Created patient profile:', patient.id);

    // Create test doctor user
    const doctorUser = await prisma.user.upsert({
        where: { email: 'doctor@healthvault.com' },
        update: {},
        create: {
            email: 'doctor@healthvault.com',
            password,
            firstName: 'Sarah',
            lastName: 'Smith',
            role: UserRole.DOCTOR,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            phoneNumber: '+11234567892',
            dateOfBirth: new Date('1985-05-20'),
        },
    });

    console.log('Created doctor user:', doctorUser.email);

    // Create doctor profile
    const doctor = await prisma.doctor.upsert({
        where: { userId: doctorUser.id },
        update: {},
        create: {
            userId: doctorUser.id,
            specialty: DoctorSpecialty.GENERAL_PRACTITIONER,
            licenseNumber: 'MD123456',
            experience: 10,
            education: 'Warsaw Medical University',
            consultationFee: 150.00,
        },
    });

    console.log('Created doctor profile:', doctor.id);

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@healthvault.com' },
        update: {},
        create: {
            email: 'admin@healthvault.com',
            password,
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            phoneNumber: '+11234567893',
        },
    });

    console.log('Created admin user:', adminUser.email);

    // Create some appointments
    const appointment = await prisma.appointment.create({
        data: {
            patientId: patient.id,
            doctorId: doctor.id,
            scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            type: AppointmentType.IN_PERSON,
            status: AppointmentStatus.SCHEDULED,
            reason: 'Regular checkup',
            duration: 30,
            notes: 'Annual physical examination',
        },
    });

    console.log('Created appointment:', appointment.id);

    // Create a medical record
    const medicalRecord = await prisma.medicalRecord.create({
        data: {
            patientId: patient.id,
            doctorId: doctor.id,
            recordType: 'consultation',
            title: 'Common Cold Consultation',
            description: 'Patient presented with mild fever and cough. Prescribed rest and fluids.',
            diagnosis: 'Common Cold',
            symptoms: ['Fever', 'Cough', 'Runny nose'],
            treatment: 'Rest, fluids, acetaminophen as needed',
        },
    });

    console.log('Created medical record:', medicalRecord.id);

    // Create a prescription
    const prescription = await prisma.prescription.create({
        data: {
            patientId: patient.id,
            doctorId: doctor.id,
            diagnosis: 'Common Cold',
            notes: 'Take medication with food',
            status: PrescriptionStatus.ACTIVE,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    });

    console.log('Created prescription:', prescription.id);

    // Create vital signs
    const vitalSign = await prisma.vitalSign.create({
        data: {
            patientId: patient.id,
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 80,
            heartRate: 72,
            temperature: 98.6,
            weight: 75.5,
            height: 175,
            oxygenSaturation: 98,
            notes: 'Normal vital signs',
        },
    });

    console.log('Created vital signs:', vitalSign.id);

    console.log(`\n✅ Seeding finished.`);
    console.log(`\n📋 Test Users:`);
    console.log(`  Patient: patient@healthvault.com / Test123456!`);
    console.log(`   Doctor: doctor@healthvault.com / Test123456!`);
    console.log(`    Admin: admin@healthvault.com / Test123456!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

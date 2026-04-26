// Migration script to add patientId to existing patients
const mongoose = require('mongoose');
const Patient = require('./models/Patient');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clinic_management')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Find all patients without patientId
        const patientsWithoutId = await Patient.find({
            $or: [
                { patientId: { $exists: false } },
                { patientId: null },
                { patientId: '' }
            ]
        });

        console.log(`Found ${patientsWithoutId.length} patients without patientId`);

        // Function to generate random 6-character alphanumeric ID
        function generatePatientId() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        // Update each patient
        for (const patient of patientsWithoutId) {
            let isUnique = false;
            let newId;

            while (!isUnique) {
                newId = generatePatientId();
                const existing = await Patient.findOne({ patientId: newId });
                if (!existing) {
                    isUnique = true;
                }
            }

            patient.patientId = newId;
            await patient.save();
            console.log(`Updated ${patient.name} with patientId: ${newId}`);
        }

        console.log('Migration completed!');

        // Show all patients with their IDs
        const allPatients = await Patient.find();
        console.log('\nAll patients:');
        allPatients.forEach(p => {
            console.log(`${p.name} - ID: ${p.patientId}`);
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });

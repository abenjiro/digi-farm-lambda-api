import Farmer from "../models/farmer.model.js";

export class FarmerService {

    async getOneFarmer(id:any) {

        try {
            const farmer = await Farmer.findByPk(id);
            if (!farmer) {
                return { status: 'error', message: 'Registration not found' }; 
            }

            return {
                responseCode: '200',
                responseMessage: 'found farmer',
                data: farmer,
            };
        } catch (error:any) {
            console.error('Error creating student registration:', error);

            return {
                responseCode: '500',
                responseMessage: 'An error occurred while processing the request',
                error: error.message,
            };
        }

    }


}
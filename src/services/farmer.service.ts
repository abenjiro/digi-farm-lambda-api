import Farmer from "../models/farmer.model.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { CONFIG_PARAMS } from "../helpers/config.js";

const farm_api_env:{jwt_secret:string} = CONFIG_PARAMS.farm_env;

export class FarmerService {

    // fetch single farmer
    async getOneFarmer(id: any) {

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
        } catch (error: any) {
            console.error('Error creating student registration:', error);

            return {
                responseCode: '500',
                responseMessage: 'An error occurred while processing the request',
                error: error.message,
            };
        }

    }

    // create user
    async createUser(requestBody: any) {
        let { username, password, email } = requestBody;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username: username,
                password: hashedPassword, // Pre-hashed bcrypt password
                email: email,
            });

            console.log("User created successfully");

            //create farmer record
            console.log("Creating farmer");
            let farmer = await this.createFarmer(newUser, requestBody)

            return {
                data: farmer,
                responseMessage: "Farmer created successfully",
                responseCode: 200,
            };

        } catch (error: any) {
            console.error("Error creating user:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "An error occurred while creating user",
                    error: error.message,
                }),
            };

        }
    }

    // create farmer
    async createFarmer(newUser: any, requestBody: any) {
        try {
            let { first_name, last_name, phone_number, location, digital_location, farm_size } = requestBody;
            const FarmerResponse = await Farmer.create({
                user_id: newUser.id,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                location: location,
                digital_location: digital_location,
                farm_size: farm_size,
            });

            console.log("Farmer created successfully");

            return FarmerResponse;

        } catch (error: any) {
            console.error("Error creating farmer:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "An error occurred while creating farmer",
                    error: error.message,
                }),
            };
        }
    }

    //login
    async login(creds: any) {
        try {
            const { email, password } = creds;
            const SECRET_KEY = farm_api_env.jwt_secret;

            // Check if user exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Invalid email or password" }),
                };
            }

            // Compare provided password with hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Invalid email or password" }),
                };
            }

            if (!SECRET_KEY) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }
            // Generate JWT Token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                SECRET_KEY,
                { expiresIn: "3h" } // Token expires in 3 hours
            );

            return {
                token,
                responseMessage: "Login successful",
                responseCode: 200,
            };

        } catch (error:any) {
            console.error("Error during login:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "An error occurred during login", error: error.message }),
            };
        }
    }


}
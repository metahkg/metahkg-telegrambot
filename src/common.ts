import dotenv from 'dotenv';
dotenv.config();
export const token:string = process.env.tgtoken;
export const admins:number[] = JSON.parse(process.env.admins);
export const mongouri:string = process.env.mongouri;
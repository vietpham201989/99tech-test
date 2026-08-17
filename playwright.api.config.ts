//env
import dotenv from "dotenv"
dotenv.config()

const env = process.env.RUNNING_ENV || ".local"
import { defineConfig } from "@playwright/test"
//declare
dotenv.config({
  path: `.env${env}`,
})
console.log("API_URL:", process.env.API_URL)
export default defineConfig({
  testDir: "./tests/api",
  reporter: [["html"], ["list"], ["allure-playwright"]],
  timeout: 15 * 60 * 1000,
  use: {
    baseURL: process.env.API_URL,
  },
})

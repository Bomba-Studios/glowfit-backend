import app from "../src/app.js";
import { PrismaClient } from "@prisma/client";
import http from "http";

const prisma = new PrismaClient();

const verify = async () => {
  try {
    // 1. Get a user
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found, creating one...");
      user = await prisma.user.create({
        data: {
          email: `test_${Date.now()}@example.com`,
          password: "password123",
          name: "Test User",
        },
      });
    }
    console.log("User ID:", user.id);

    // 2. Start server
    const server = http.createServer(app);
    const port = 3002; // Use a different port to avoid conflict
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // 3. Send request
    const response = await fetch(`http://localhost:${port}/routines/user/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response body:", JSON.stringify(data, null, 2));

    if (response.status === 200 && Array.isArray(data)) {
      console.log("SUCCESS: Routines retrieved successfully");
    } else {
      console.error("FAILURE: Failed to retrieve routines");
    }

    // 4. Cleanup
    server.close();
    await prisma.$disconnect();
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

verify();

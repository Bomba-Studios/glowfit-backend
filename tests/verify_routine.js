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
    const port = 3001;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // 3. Create routine payload
    const payload = {
      name: "My First Routine",
      description: "A test routine",
      user_id: user.id,
      estimated_duration: 60,
      level: "Beginner",
      goal: "Strength",
      is_active: true,
      days: [1, 3, 5], // Assuming days 1, 3, 5 exist in days_of_week
      exercises: [], // Empty for now or add if I have exercise IDs
    };

    // 4. Send request
    const response = await fetch(`http://localhost:${port}/routines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response body:", JSON.stringify(data, null, 2));

    if (response.status === 201) {
      console.log("SUCCESS: Routine created successfully");
    } else {
      console.error("FAILURE: Routine creation failed");
    }

    // 5. Cleanup
    server.close();
    await prisma.$disconnect();
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

verify();

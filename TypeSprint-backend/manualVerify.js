const bcrypt = require("bcryptjs");

async function a() {
  const providedPassword = "123456789";
  const salt = "$2a$10$Vtbq8R8AT7cQxeSw9jBnCe";
  console.log(salt);
  const hashedPassword = await bcrypt.hash(providedPassword, salt);
  console.log(hashedPassword);
  const storedHash =
    "$2a$10$Vtbq8R8AT7cQxeSw9jBnCeFjAfA1g65O4kUv7Gilte0Xs/7K3XxRa"; // Replace with the new stored hash for test2@gmail.com

  bcrypt.compare(providedPassword, storedHash, (err, isMatch) => {
    if (err) {
      console.error("Error during manual hash comparison:", err);
    } else {
      console.log(`Manual check - Passwords match: ${isMatch}`);
    }
  });
}

a();

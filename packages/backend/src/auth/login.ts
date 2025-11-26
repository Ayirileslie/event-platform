import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "../utils/user";
import { signJwt } from "../lib/jwt";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || "{}");
    if (!email || !password) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Missing email or password" }) 
      };
    }

    const user = await getUserByEmail(email.toLowerCase());
    
    if (!user.Item) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: "Invalid credentials" }) 
      };
    }

    const valid = await bcrypt.compare(password, user.Item.passwordHash);
    
    if (!valid) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: "Invalid credentials" }) 
      };
    }

    const token = signJwt({ 
      userId: user.Item.email,
      email: user.Item.email, 
      role: user.Item.role 
    });

    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        token,
        user: {
          _id: user.Item.email,
          name: user.Item.email.split('@')[0], // Extract name from email
          email: user.Item.email,
          role: user.Item.role,
        }
      }) 
    };
  } catch (err: any) {
    console.error("Login error:", err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Server error" }) 
    };
  }
};

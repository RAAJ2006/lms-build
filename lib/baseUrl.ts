// const baseUrl =
//   process.env.NODE_ENV === "production"
//     ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//     : `${process.env.NEXT_PUBLIC_BASE_URL}`;

// export default baseUrl;
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Default to localhost for development

export default baseUrl;
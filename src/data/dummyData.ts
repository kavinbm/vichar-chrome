
export const dummyPrompts = [
  {
    id: "1",
    title: "Content Writer for Blog Posts",
    text: "I want you to act as a content writer for my blog. Write a well-structured, SEO-optimized blog post on [TOPIC]. Include an engaging introduction, 3-5 main sections with subheadings, and a conclusion. Use a conversational tone, include examples, and make it approximately 1500 words.",
    author: "Marketing Team",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "2",
    title: "Interview Question Generator",
    text: "You are a hiring manager preparing for an interview. Generate 10 interview questions for a [POSITION] role. Include a mix of technical questions, behavioral questions, and scenario-based questions that will help assess the candidate's skills, experience, and cultural fit.",
    author: "HR Department",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "3",
    title: "Code Reviewer",
    text: "Act as a senior software developer reviewing my code. I'll share a piece of code and I want you to review it for: 1) Potential bugs or errors, 2) Performance issues, 3) Readability and maintainability, 4) Security concerns, and 5) Suggestions for improvement. Be specific in your feedback and provide examples of how to improve the code.",
    author: "Dev Team",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "4",
    title: "Learning Plan Creator",
    text: "Create a detailed learning plan for me to become proficient in [SKILL/TOPIC] from scratch. Include recommended resources (books, courses, videos, projects), a week-by-week learning schedule for 3 months, milestones to track progress, and suggestions for practical applications of what I'm learning.",
    author: "",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "5",
    title: "Email Response Composer",
    text: "Help me craft a professional email response to the following message: [PASTE EMAIL]. The tone should be [formal/casual/friendly], and I want to [agree/decline/negotiate/ask for more information]. Make sure the response is clear, concise, and appropriate for a business context.",
    author: "Communication Team",
    createdAt: new Date().toISOString(), // Just now
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Product Description Writer",
    text: "Act as a copywriter for e-commerce products. Write a compelling product description for a [PRODUCT TYPE] that highlights its features, benefits, unique selling points, and appeals to the target audience of [TARGET AUDIENCE]. The description should be approximately 200 words and include a catchy headline.",
    author: "Sales Team",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

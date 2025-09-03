const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "quizdb";
const containerId = "results";

app.http('submitResult', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let body;
        try {
            body = await request.json();
        } catch (err) {
            context.log("Invalid JSON in request body:", err.message);
            return {
                status: 400,
                body: "Invalid JSON in request body.",
            };
        }

        const { score, totalQuestions, timestamp } = body;

        if (
            typeof score !== "number" ||
            typeof totalQuestions !== "number" ||
            !timestamp
        ) {
            context.log("Missing or invalid fields in request body:", body);
            return {
                status: 400,
                body: "Missing or invalid fields in request body.",
            };
        }

        try {
            const client = new CosmosClient({ endpoint, key });
            const database = client.database(databaseId);
            const container = database.container(containerId);

            const item = {
                score,
                totalQuestions,
                timestamp,
            };
            await container.items.create(item);

            return {
                status: 201,
                jsonBody: { message: "Result saved" },
            };
        } catch (err) {
            context.log("Error saving result to Cosmos DB:", err.message);
            return {
                status: 500,
                body: "Error saving result to database",
            };
        }
    }
});
const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "quizdb"; // change if your DB name is different
const containerId = "questions"; // change if your container name is different

app.http('getQuestions', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const client = new CosmosClient({ endpoint, key });
        const database = client.database(databaseId);
        const container = database.container(containerId);

        const { resources: questions } = await container.items.query('SELECT * FROM c').fetchAll();

        return {
            status: 200,
            jsonBody: questions
        };
    }
});
export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const response = await fetch(
			`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v55.0/query?q=SELECT+Id,FirstName,LastName,Email,Description+FROM+Contact+WHERE+IsDeleted=false+ORDER+BY+CreatedDate+DESC+LIMIT+10`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return res
				.status(500)
				.json({ error: "Failed to fetch contacts", details: data });
		}

		res.status(200).json({ contacts: data.records });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
}

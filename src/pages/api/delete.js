export default async function handler(req, res) {
	if (req.method !== "DELETE") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { clientId } = req.body;

	//delete from salesforce
	try {
		const response = await fetch(
			`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v55.0/sobjects/Contact/${clientId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			return res.status(500).json({ error: "Failed to delete" });
		}

		return res.status(200).json({ message: "User deleted" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Something went wrong." });
	}
}

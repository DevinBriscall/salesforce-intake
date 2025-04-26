export default async function handler(req, res) {
	if (req.method !== "PATCH") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	//extract our data from the request body
	const { clientId, first, last, email, notes } = req.body;

	try {
		const response = await fetch(
			`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v55.0/sobjects/Contact/${clientId}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					FirstName: first,
					LastName: last,
					Email: email,
					Description: notes,
				}),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return res
				.status(500)
				.json({ error: "Failed to update contact", details: data });
		}

		res.status(200).json({
			message: "Contact updated!",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
}

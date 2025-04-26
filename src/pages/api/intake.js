export default async function handler(req, res) {
	//make sure we are posting
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	//extract our data from the request body
	const { first, last, email, notes } = req.body;

	try {
		const response = await fetch(
			`${process.env.SALESFORCE_INSTANCE_URL}/services/data/v55.0/sobjects/Contact`,
			{
				method: "POST",
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
				.json({ error: "Failed to create contact", details: data });
		}

		//trigger Zapier webhook

		const zapierPayload = {
			clientName: `${first} ${last}`,
			clientId: data.id,
			salesforceLink: `${process.env.SALESFORCE_INSTANCE_URL}/lightning/r/Contact/${data.id}/view`,
		};

		await fetch(process.env.ZAPIER_WEBHOOK, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(zapierPayload),
		});

		res.status(200).json({
			message: "Contact created!",
			salesforceId: data.id,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
}

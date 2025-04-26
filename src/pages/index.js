import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//INTAKE FORM
export default function Home() {
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		fetchContacts();
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		const payload = Object.fromEntries(formData);

		//call our /api/intake API endpoint to upload our data to salesforce and sharepoint
		try {
			const response = await fetch("/api/intake", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			console.log("Server Resposne:", data);

			toast.success("client successfully created in salesforce");
			e.target.reset();

			//refresh the contacts list
			await fetchContacts();
		} catch (error) {
			toast.error("something went wrong");
			console.error("Error submitting form:", error);
		}
	}

	async function handleDelete(clientId) {
		try {
			const res = await fetch("/api/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ clientId }),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error("failed to delete user from SalesForce.");
				return;
			}

			toast.success("user deleted from SalesForce.");
			await fetchContacts();
		} catch (error) {
			toast.error("something went wrong");
		}
	}

	async function fetchContacts() {
		try {
			const res = await fetch("/api/contacts");
			const data = await res.json();
			setContacts(data.contacts || []);
			console.log(data.contacts);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="min-h-screen p-4 w-screen flex justify-center items-center bg-gray-300">
				{/* div to hold the form and the list of contacts */}
				<div className="flex flex-col gap-4 w-3/4">
					{/* the form */}
					<form
						onSubmit={handleSubmit}
						className="rounded-xl border-2 p-16 w-full bg-[#f1f1f1] flex flex-col gap-4 items-center"
					>
						<h1 className="text-4xl font-bold">Customer Intake Form</h1>
						<div className="flex gap-8 w-full">
							<div className="flex flex-col w-full">
								<label htmlFor="first" className="font-semibold">
									First
								</label>
								<input
									id="first"
									name="first"
									type="text"
									placeholder="first"
									className="p-2 border-2 rounded-md"
									required
								></input>
							</div>
							<div className="flex flex-col w-full">
								<label htmlFor="last" className="font-semibold">
									Last
								</label>
								<input
									id="last"
									name="last"
									type="text"
									placeholder="last"
									className="p-2 border-2 rounded-md"
								></input>
							</div>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="email" className="font-semibold">
								Email
							</label>
							<input
								required
								id="email"
								name="email"
								type="email"
								placeholder="email"
								className="p-2 border-2 rounded-md"
							></input>
						</div>
						<div className="flex flex-col w-full">
							<label htmlFor="notes" className="font-semibold">
								Notes
							</label>
							<textarea
								id="notes"
								name="notes"
								type="text"
								placeholder="notes"
								className="p-2 border-2 rounded-md resize-none"
							></textarea>
						</div>
						<button
							type="submit"
							className="bg-blue-500/90 rounded-md min-w-[200px] text-white p-3 cursor-pointer hover:bg-blue-500 transition-colors duration-300"
						>
							Submit
						</button>
					</form>
					{/* list of contacts in salesforce */}
					<div>
						<h2 className="text-2xl font-bold mb-4">Existing Clients</h2>
						{contacts.length ? (
							<ul className="bg-white p-6 rounded-lg shadow-md space-y-2">
								{contacts.map((contact) => (
									<li key={contact.Id} className="border-b pb-2">
										<div className="flex justify-between">
											<span>
												{contact.FirstName} {contact.LastName} - {contact.Email}
											</span>
											<button
												onClick={() => handleDelete(contact.Id)}
												className="text-red-500 hover:underline cursor-pointer"
											>
												DELETE
											</button>
										</div>
									</li>
								))}
							</ul>
						) : (
							<div>No clients found</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

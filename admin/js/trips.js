async function fetchTrips() {
	const token = localStorage.getItem("adminToken");
	if (!token) {
		window.location.href = "login.html";
		return;
	}

	try {
		const res = await fetch("http://localhost:5000/api/admin/trips", {
			headers: { Authorization: `Bearer ${token}` },
		});

		const trips = await res.json();
		const tableBody = document.querySelector("#tripsTable tbody");
		tableBody.innerHTML = "";

		trips.forEach((trip) => {
			const row = `<tr>
                <td>${trip.user.name}</td>
                <td>${trip.driver?.name || "Not Assigned"}</td>
                <td>${trip.destination}</td>
                <td>${trip.fare} EGP</td>
                <td>${trip.status}</td>
                <td>
                    <button class="delete-btn" onclick="deleteTrip('${
						trip._id
					}')">❌ Delete</button>

				</td>
            </tr>`;
			tableBody.innerHTML += row;
		});
	} catch (error) {
		alert("🚨 Failed to fetch trips: " + error.message);
	}
}
async function deleteTrip(tripId) {
	const token = localStorage.getItem("adminToken");

	try {
		const res = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			alert("✅ Trip deleted successfully!");
			fetchTrips();
		} else {
			alert("❌ Failed to delete trip.");
		}
	} catch (error) {
		alert("🚨 Error: " + error.message);
	}
}

fetchTrips();

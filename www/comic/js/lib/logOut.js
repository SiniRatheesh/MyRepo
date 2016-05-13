 function userLogOut() {
				$.getJSON(REST_SERVER+'logOut',
						function(data) {
			if (data.response = "success") {
				window.location.href = "home.html";
			}
		});

	} 
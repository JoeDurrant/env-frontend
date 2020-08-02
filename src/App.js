import React, { useState, useCallback } from 'react';
import logo from "./logo.svg";
import "./App.css";
import TemperatureGraph from "./TemperatureGraph";

const getDataUrl = "https://44tdam0sq0.execute-api.eu-west-2.amazonaws.com/default/GetEnvData";

const App = () => {
	const [apiKey, setApiKey] = useState("");
	const [apiKeyConfirmed, setApiKeyConfirmed] = useState(false);
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);

	const getData = useCallback(async () => {
		let requestOptions = {
			method: "GET",
			headers: {
				"x-api-key": apiKey
			}
		};

		try {
			const response = await fetch(getDataUrl, requestOptions);

			let responseString = await response.json();

			if (response.ok) {
				setData(JSON.parse(responseString.body));
				setApiKeyConfirmed(true);
			}
			else {
				if (responseString.message === "Forbidden") {
					console.error(`Error ${response.status}. Invalid API Key`);
					alert("invalid api key");
				}
				else {
					console.error(`Error ${response.status}. ${responseString}`);
				}				
			}
		}
		catch (e) {
			console.error(e);
		}
		finally {
			setLoading(false);
		}
	});

	return (
		<div className="App">
			{!apiKeyConfirmed &&
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Greenhouse</h1>
					<h2>Enter API Key</h2>
					<p className="App-intro">
						<input type="text" onChange={e => { setApiKey(e.target.value) }} />
						<button type="button" onClick={e => {setLoading(true); getData(e);}}>Submit</button>
					</p>
				</header>
			}

			{apiKeyConfirmed &&
				<>
					{loading &&
						<div>Loading...</div>
					}

					{!loading &&
						<div>Loading...</div>
					}
					<div>
						<TemperatureGraph temperatureData={data.temperature} />
					</div>
				</>
			}
		</div>
	);
};

export default App;
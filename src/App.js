import React, { useState, useCallback, useEffect } from 'react';
import logo from "./logo.svg";
import "./App.css";
import TemperatureGraph from "./TemperatureGraph";

const getDataUrl = "https://44tdam0sq0.execute-api.eu-west-2.amazonaws.com/default/GetEnvData";

const App = () => {
	const [apiKey, setApiKey] = useState("");
	const [apiKeyConfirmed, setApiKeyConfirmed] = useState(false);
	const [apiKeyInvalid, setApiKeyInvalid] = useState(false);
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);

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
				setApiKeyInvalid(false);
			}
			else {
				if (responseString.message === "Forbidden") {
					console.error(`Error ${response.status}. Invalid API Key`);
				}
				else {
					console.error(`Error ${response.status}. ${responseString}`);
				}

				setApiKeyInvalid(true);
			}
		}
		catch (e) {
			console.error(e);
			setApiKeyInvalid(true);
		}
		finally {
			setApiKeyConfirmed(true);
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
						<button type="button" onClick={e => getData(e)}>Submit</button>
					</p>
				</header>
			}

			{apiKeyConfirmed &&
				<div>
					<TemperatureGraph temperatureData={data.temperature} />
				</div>
			}
		</div>
	);
};

export default App;
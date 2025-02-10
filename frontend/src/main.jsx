import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { EventBusProvider } from "./EventBus.jsx";
import { BrowserRouter } from "react-router-dom";
import global from 'global';
global.global = global;

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<EventBusProvider>
				<App />
			</EventBusProvider>
		</BrowserRouter>
	</StrictMode>
);
